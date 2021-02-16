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
