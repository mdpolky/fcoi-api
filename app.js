import fetch from "node-fetch";
import express from "express";
import cors from "cors";
import { XMLParser } from "fast-xml-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:8081"], //TODO: whitelist dev/prod envs
  })
);

app.set("port", process.env.PORT || 3000);

const base_url = "https://fantasysports.yahooapis.com/fantasy/v2";

const protectedRoute = (req, res, next) => {
  //lazy/fail fast, else trust yahoo to verify token
  if (!req.headers.authorization) {
    res.status(403).send("Access denied.");
    return;
  }

  next();
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/* Returns {leagues: [{}, {}]} where each object in the leagues array is an 
active NHL fantasy hockey league based on the authorized yahoo user. */
app.get("/leagues", protectedRoute, async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const reqOptions = {
      method: "Get",
      headers: {
        Authorization: accessToken,
      },
    };
    const response = await fetch(
      base_url + "/users;use_login=1/games;out=leagues",
      reqOptions
    );
    if (response.status !== 200) {
      res.status(response.status).send(response);
    } else if (response.status === 200) {
      let xmlJson = await xmlToJson(response.body);
      const nhlLeagues = xmlJson.fantasy_content.users.user.games.game
        .filter((x) => x.code === "nhl")
        .map((container) => {
          return container.leagues.league;
        });
      res.json({
        leagues: nhlLeagues,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

app.get("/leagues/:league_key/standings", protectedRoute, async (req, res) => {
  try {
    const leagueKey = req.params.league_key;
    const accessToken = req.headers.authorization;
    const reqOptions = {
      method: "Get",
      headers: {
        Authorization: accessToken,
      },
    };
    const response = await fetch(
      base_url + `/league/${leagueKey}/standings`,
      reqOptions
    );
    let xmlJson = await xmlToJson(response.body);
    res.json(xmlJson);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

/* 
  possible additions:
  /matchups ;weeks1,5, 
  /stats ;type=season, 
  /stats ;type=date ;date=2011-07-06
  /roster ;week=10
  /roster/players
*/
app.get("/teams/:team_key", protectedRoute, async (req, res) => {
  try {
    const teamKey = req.params.team_key;
    const accessToken = req.headers.authorization;
    const reqOptions = {
      method: "Get",
      headers: {
        Authorization: accessToken,
      },
    };
    const response = await fetch(
      base_url + `/team/${teamKey}?format=json`,
      reqOptions
    );
    res.json(await response.json());
  } catch (err) {
    console.error(err);
  }
});

app.listen(app.get("port"), () => {
  console.log(`fcoi-api listening on port ${app.get("port")}`);
});

async function xmlToJson(xmlReadable) {
  let xmlData = "";
  for await (const chunk of xmlReadable) {
    xmlData += chunk;
  }
  const parser = new XMLParser();
  return parser.parse(xmlData);
}
