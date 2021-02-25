import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";

const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <h1>Header</h1>
      <Component {...pageProps} />
    </div>
  );
};

// ONLY in _app.js, context (ctx) is a nested object inside another object...
// We need to call this component any name other than App... (next.js ideosyncracies...)
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  //if a page component has a getInitialProps function - then invoke it here...
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    //the ctx property is intended to go into a individual page
    //appContext is intended to go into app component
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  console.log(pageProps);

  return data;
};

export default AppComponent;
