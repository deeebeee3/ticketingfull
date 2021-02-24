import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // we are on the server!
    // requests should be made like:
    // http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser

    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers, //just pass through all the headers from incoming request (host, cookie etc...)
    });
  } else {
    // we are on the browser!
    // requests can be made with a base url of '/' like:
    // /api/users/currentuser

    return axios.create({
      baseURL: "/",
    });
  }
};
