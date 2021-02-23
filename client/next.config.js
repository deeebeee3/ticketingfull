//This file gets loaded by next.js automatically when our project starts up
//It will run the webpackDevMiddleware function - poll all the files inside project
//directory every 300 ms - rather than trying to watch for file changes in som automated way...
//should fix any issues with file change detection when running inside docker container...

module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
