import fetch from "node-fetch";
import express from "express";
const app = express();

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
      base_url +
        "/users;use_login=1/games;game_keys=nhl;out=leagues?format=json",
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
