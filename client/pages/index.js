import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are signed out</h1>;
};

// This is server-side logic (is run on the server if hard refresh in browser,
// or navigating to app from external link) - but there is one time it gets run
// on the browser - when navigating between pages inside of our app
LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get("/api/users/currentuser");

  return data;
};

export default LandingPage;
