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

Install Ingress-nginx if you restarted / reset your cluster

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
