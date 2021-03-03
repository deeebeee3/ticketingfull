# ticketingfull

Microservices Project

---

docker build -t deepakbhari/auth .

Successfully built dbe78a9de579
Successfully tagged deepakbhari/auth:latest

image created and pushed to docker hub

now we need to tell our deployment to use this image:

deployment is going to create one pod (replicas: 1), with an instance of the image running inside it...

service will give access to the pod

---

skaffold dev (ctrl c and run again if get an error)

---

## Install Ingress-nginx if you restarted / reset your cluster

https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.44.0/deploy/static/provider/cloud/deploy.yaml

add ingress-srv.yaml to forward requests to ticketing.dev/api/users/\*\* to
our auth-srv service - send it to the service on the port 3000.

---

Hosts file / security warning:

code /etc/hosts

In hosts file add:

\# Added by Deepak - Microservices Dev Stuff
127.0.0.1 ticketing.dev

To test navigate to ticketing.dev/api/users/currentuser in browser..

type: thisisunsafe (to get past unsecure connection error)

---

cd auth

npm install express-validator

---

kubectl get pods

---

Fix skaffold + ts-node-dev issue (not rebuilding properly)

For those having issues with the automatic reload of ts-node-dev, the issue seems to be related to the composite of both tools.

ts-node-dev alone runs ok locally, but when running it inside of a Pod by means of skaffold, it syncs the new changed file properly into the Pod but the job itself inside of the Pod doesn't seem to reload.

Long story short: use nodemon + ts-node instead of ts-node-dev

---

Authentication Session / JWT stuff

1.) Make sure any requests are https otherwise cookies won't be used...

app.use(cookieSession({
signed: false, //don't encrypt cookie contents
secure: true, // cookies only used if using https
})
);

2.) Check contents of encoding cookie by copying the value and going to

https://www.base64decode.org/

Paste cookie contents in there - hit decode - and we will see our decoded session but encoded JWT contents...

INPUT:
eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall3TW1VNE9UVm1OVFkxWkdFNU1EQTJZbVJtTmpGalpTSXNJbVZ0WVdsc0lqb2lkR1Z6WkhSbFFHNXJiaTVqYjIwaUxDSnBZWFFpT2pFMk1UTTJOakkxTlRsOS5fRVNlUUpRRklBeEFxLTN5UjFMQUJtOFBqM0dOd09uSDhSeUk5RHhZODg0In0%3D

OUTPUT:
{"jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMmU4OTVmNTY1ZGE5MDA2YmRmNjFjZSIsImVtYWlsIjoidGVzZHRlQG5rbi5jb20iLCJpYXQiOjE2MTM2NjI1NTl9.\_ESeQJQFIAxAq-3yR1LABm8Pj3GNwOnH8RyI9DxY884"}7

https://jwt.io/

Remember in this example we set a signing key of 'asdf'

We shouldn't store the signing key as plain text as we have done so far...

---

## Create an all purpose secret inside a Kubernetes Cluster:

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf

kubectl get secrets

kubectl describe secret jwt-secret

kubectl delete secret jwt-secret

---

Take the secret and set it on the environmental variables inside ours pods...
(for example in the Auth Service - auth.depl.yaml):

          env:
            - name: JWT_KEY
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: JWT_KEY

---

DEBUGGING PODS:

If you try to reference a secret that doesn't exist, inside a pod, kubernetes
will not start up that pod... Use the following to debug...

kubectl get pods (will list pods and their statuses)

Do a describe on a pod that has an error status to find out info why it didnt start...

kubectl describe pod auth-depl-589c5bbc9c-77cmk

---

Use --save-dev flag, so we don't download these test dependencies everytime we build our image... we don't want to keep downloading and installing mongo-memory-server (80mb)... We're not going to be running tests inside the image - thats why we installed them as dev dependencies...

In Dockerfile add --only=prod flag to RUN command... - so it will only install prod dependencies

RUN npm install --only=prod

---

# Testing

--no-cache flag will stop jest getting confused everytime we try to change a ts file

preset": "ts-jest" - adds in ts support for jest...

supertest lib will allow us to fake a request to the express application.

Whenever jest runs our tests at the terminal its going to set NODE_ENV to 'test'...
For cookie-session We want secure to be FALSE, when not in prod environment
because supertest uses http by default rather than https...

secure: process.env.NODE_ENV !== "test"

---

# SSR Next.js

We not going to use TS for next.js client app - brings minimal benefit
for lots of extra effort. But all other services will use TS...

-

To run the next.js app locally - inside client folder:

npm run dev

go to: localhost:3000/ - should see landing page...

-

Build the docker image for the Client App
(only if you want to make sure it builds correctly first and want to push to Docker hub too...):

docker build -t deepakbhari/client .

dot (.) means current directory as the context for the build...

Successfully built ffabfb7d0944
Successfully tagged deepakbhari/client:latest

push image up to docker hub:

docker push deepakbhari/client

-

Now lets, get our client app running inside our kubernetes cluster...

1. create a deplyment config file in k8s dir...

2. add some config to skaffold.yaml

3. set up some routing rules inside ingress-srv.yaml

Path order is important - most specific ones at top, and least specific / catch all - at bottom:

        paths:
          - path: /api/users/?(.*)
            backend:
              serviceName: auth-srv
              servicePort: 3000
          - path: /?(.*)
            backend:
              serviceName: client-srv
              servicePort: 3000

Now should see Landing page here after running skaffold dev:

https://ticketing.dev/

-

After adding / making change to next.config.js - we need to manually restart our client pod...
To do this - we need to manually delete the client pod - and then that pod will be recreated...

kubectl get pods

> client-depl-559b6d6576-ptsmz

kubectl delete pod client-depl-559b6d6576-ptsmz

kubectl get pods

> client-depl-559b6d6576-x5zgb

:-)

-

Create our own custom App wrapper component (that wraps our pages) to replace next.js
default one that happens behind the scenes...

{ Component, pageProps }

We can only import global css in this \_app file...

---

##NAMESPACES...

kubectl get namespace

"default" is the name of the namespace that we are currently creating our
services in...

NAME STATUS AGE
default Active 3h13m
ingress-nginx Active 15m
kube-node-lease Active 3h14m
kube-public Active 3h14m
kube-system Active 3h14m

We can access services using that "http://auth-srv" style ONLY when
they are in the same namespace...

Auth and Client services are running in the same namespace

BUT Ingress Nginx is in it's own seperate namespace...

So to do CROSS-NAMESPACE Communication our domain will look like:

"http://NAME_OF_SERVICE.NAMESPACE.svc.cluster.local"

kubectl get namespace

kubectl get services (will get services inside "default" namespace)

Get the services running INSIDE a particular namespace

kubectl get services -n ingress-nginx
(lists services running inside ingress-nginx namespace)

Example:

"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"

Thats how we reach from our client inside the default namespace across to
the ingress-nginx namespace and access the service inside of there...

So for the request from the server side script inside our next.js app
will look like:

"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser"

Just need to make sure we pass along cookie as well :-)

\*\*Can create an External Name Service in the future to do domain mapping...
so:

http://short-form-url/api/users/currentuser

maps to

http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser

But we'll leave this for now...

---

Auth Sign Up Header - two possible scenarios:

[false, false, { label: "Sign Out", href: "/auth/signout" }]

[{ label: "Sign Up", href: "/auth/signup" }, { label: "Sign In", href: "/auth/signin" }, false]

.filter(linkConfig => linkConfig) will only return the indices that are not false...
.map() then we will map over the truthy ones to and return a link...

---

# NPM - create package for shared code between services

in root mkdir common

cd common - npm init -y

---

organisation / package name:

"name": "@ddbtickets/common"

cd ticketingfull - add and commit changes

cd common - npm publish --access public

...will publish package

we will write typescript but publish javascript...

tsc --init
npm install typescript del-cli --save-dev

---

before building, delete old build folder:

    "clean": "del ./build/*",
    "build": "npm run clean && tsc"

deepakbhari@MacBook-Pro-2 common % npm run build

---

To publish...

Make changes to code in src folder

update package version:

deepakbhari@MacBook-Pro-2 common % npm version patch

or

manually increment in package.json

then

npm run build

---

Use this command ONLY during development to make our lives easier:

    "pub": "git add . && git commit -m \"Updates\" && npm version patch && npm run build && npm publish"

npm run pub

---

# NATS STREAMING SERVER

Always read docs for NATS Streaming Server - not NATS on it's own...

https://docs.nats.io/developing-with-nats-streaming/streaming

Use official 'nats-streaming' docker image:

https://hub.docker.com/_/nats-streaming

look at 'nats-streaming' docker image commandsline options...

start up skaffold dev:

- deployment.apps/nats-depl created
- service/nats-srv created

kubectl get pods

make sure nat-depl pod is running:

nats-depl-7ddff778f9-kwh24 1/1 Running 0 2m

---

https://www.npmjs.com/package/node-nats-streaming

callback based...

Start creating standalone NATS streaming sub project - to find out how internals work...

tsc --init
npm install -g typescript

The ts-node-dev library recently released a change that disables this restart behavior by default. To enable it, add --rs to scripts in package.json

---

## Port forwarding (just for use during dev, to quickly temporarily access something)

Port Forwarding - for standalone NATS project - to get access to Pod running nats streaming server...

kubectl get pods

NAME READY STATUS RESTARTS AGE
auth-depl-6f75d854d5-r6p5w 1/1 Running 0 34m
auth-mongo-depl-54f54b8589-b9hf2 1/1 Running 0 34m
client-depl-6554588ccd-vsfxb 1/1 Running 0 34m
nats-depl-7ddff778f9-kwh24 1/1 Running 0 34m
tickets-depl-679f8d45c9-jtr4x 1/1 Running 0 34m
tickets-mongo-depl-76769f4565-8f95w 1/1 Running 0 34m

kubectl port-forward nats-depl-7ddff778f9-kwh24 4222:4222

4222:4222

- port on local machine that we want to use to get access to the pod
- port on the pod that we are trying to access

Forwarding from 127.0.0.1:4222 -> 4222
Forwarding from [::1]:4222 -> 4222

then in another terminal window run

npm run publish

[INFO] 10:20:50 ts-node-dev ver. 1.1.6 (using ts-node ver. 9.1.1, typescript ver. 4.2.2)
Publisher connected to NATS

---

in terminal window where listen or publish scripts running - can type rs to restart program...

---

If in future we a service is geeting alot of traffic we can do either:

vertical scaling - more CPU, RAM to the service
horizontal scaling - created a second instance of a service

---
