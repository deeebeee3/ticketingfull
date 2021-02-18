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

How to create an all purpose secret inside a Kubernetes Cluster:

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf

kubectl get secrets

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
