# Espresso

Minimalistic Express api template used to power personal open-source projects.

Currently set up to use Docker and Kubernetes to manage deployments.

### Getting Started

This project is focused on getting an Express api deployed to Kubernetes(k8s) locally. `minikube` is used for local k8s and assumes you also have Docker installed (or a similarly compatible container or VM environment).

### Run app locally

Run the following commands in the project's root directory

```

npm install

npm start

```

### Docker

If using vscode you can use the Docker extension to make creating and pushing the image easier.

### Start k8s clusters

```

minikube start

```

### Tunnel

The tunnel command creates a network route on the host to the service CIDR of the cluster using the cluster’s IP address as a gateway. It exposes the external IP directly to any program running on the host operating system. Ctrl-C in the terminal can be used to terminate the process at which time the network routes will be cleaned up.

```

minikube tunnel

```

### Create and expose deployment

The image points to a repository on https://hub.docker.com/, which provides free hosting for public repos.

```

kubectl create deployment espresso --image=mdpolky/espresso:latest

kubectl expose deployment espresso --type=LoadBalancer --port=8080

```

## API Endpoints

Currently the api is minimal, as the project is focused primarily on getting CI/CD integrations functioning in a local environment.

---

### GET

```

/

```

### Request

```

curl --location 'http://localhost:3000'

```

### Response

```

Hello World!

```

---
