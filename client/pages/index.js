import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>Landing Page</h1>;
};

// This is server-side logic (is run on the server if hard refresh in browser,
// or navigating to app from external link) - but there is one time it gets run
// on the browser - when navigating between pages inside of our app
LandingPage.getInitialProps = async () => {
  if (typeof window === "undefined") {
    // we are on the server!
    // requests should be made to
    // http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser
    const { data } = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: {
          Host: "ticketing.dev",
        },
      }
    );

    return data;
  } else {
    // we are on the browser!
    // requests can be made with a base url of '' like:
    // /api/users/currentuser
    const { data } = await axios.get("/api/users/currentuser");

    return data;
  }
  return {};
};

export default LandingPage;
