import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>Landing Page</h1>;
};

//next.js will call this func, while it is attempting to render the application
//on the server one time. We can use it to fetch some initial data the component needs.
LandingPage.getInitialProps = async () => {
  if (typeof window === "undefined") {
    /*     
      we are on the server
      requests should be made like: 
      http://ingress-nginx.ingress-nginx.svc.cluster.local/api/users/currentuser 
    */

    const { data } = await axios.get(
      "http://ingress-nginx.ingress-nginx.svc.cluster.local/api/users/currentuser" <
        {
          //need this so ingress-nginx knows which domain we are accessing routing rules for
          //see line 10 in ingress-srv.yaml
          headers: {
            Host: "ticketing.dev",
          },
        }
    );

    return data;
  } else {
    /*     
      we are on the browser (browser will figure out domain)
      requests should be made like: 
      /api/users/currentuser 
    */

    const { data } = await axios.get("/api/users/currentuser");

    return data;
  }
};

export default LandingPage;
