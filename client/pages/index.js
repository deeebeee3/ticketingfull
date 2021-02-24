import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

//next.js will call this func, while it is attempting to render the application
//on the server one time. We can use it to fetch some initial data the component needs.
LandingPage.getInitialProps = async () => {
  const response = await axios.get("/api/users/currentuser");

  return response.data;
};

export default LandingPage;
