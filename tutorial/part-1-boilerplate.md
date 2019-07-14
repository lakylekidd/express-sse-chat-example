# Part 1
In this part we will create the initial boilerplate of our chat api with expressJS and some additional packages.

## 1. Developer Boilerplate

For this example we will be using nodeJs with expressJS. Open your terminal and run: 
```
npm i express cors body-parser
```

In order to be able to change and run our application on the fly, we will need to install the `nodemon` tool. This will allow us to automatically re-run the server, every time we update our underline javascript code. Install the dev dependency by running:

```
npm i -D nodemon
```

In order to be able to run and test our app more efficiently, we should include the following script in our `package.json` file:

```
"start": "node server.js",
"dev": "nodemon server.js"
```

We can then run them on our terminal using the following commands: 

* ```npm start``` for running it using node.js
* ```npm run dev``` for running it using nodemon.

## 2. App Configuration

For most applications we need to setup some configurations in order to make it work more efficient. As we try to code faster and faster, we tend to neglect some DRY principles and include a lot of repeated code or references in our code. 

Some examples are:
* Connection Strings
* API Urls
* Port numbers
* etc.

In order to avoid this, at least for the most commonly used variables, we can create a `config.json` file which will act as an exported module we can use throughout our code.

This module will allow us to store some commonly used variables throughout our application by allowing us to maintain a DRY coding style.

Create a `config.json` file at the root of your app and paste the following code:
```
// Define configuration variables
const connectionString = process.env.DATABASE_URL ||
    'postgres://postgres:secret@localhost:5432/postgres';
const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

// Construct the url
const url = (process.env.NODE_ENV === 'production' ?
    host : `${host}:${port}`);

// Export the configuration module
module.exports = ({
    name: 'express-sse-chat-example',
    connectionString,
    port,
    host,
    url
});
```

Let's analyse what is happening here...
We can see an object variable `process.env`. This is a default object variable usually defined by the hosting provider to define certain vulnerable variables used by your application such as: tokens, database urls, secrets etc.

In this config file we define some variables that we will be using in our own application. We start by checking if these variables are already defined by the host, and if not we define our own. Our own variables will be applicable when we are running the application on our localhost.

At the very end, after we define the variables we need, we export an object containing those variables as a node module.

## 3. App File
The app.js file is the application definition. Create it under `api/app.js` and paste the following code:
```
// Export the app module
module.exports = () => {
    // Import required modules
    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');

    // Instantiate app
    const app = express();

    // Define a body parser
    const jsonParser = bodyParser.json();

    // Apply middlewares
    app.use(cors());
    app.use(jsonParser);

    // Return the app module
    return app;
}
```

In this file we export a node module that defines our application. We will be using express as our server and body parser to decode data in the body of the requests along with cors to allow cross-origin resource sharing.

We instantiate the app with express, define the json parser for parsing data and apply the middlewares of cors and json parser to our app.

After that we are returning the app and export it as a module. This strategy will allow us to easily replace any modules used here in the future.

## Server File
The server file is the entrance point of our application. This is the file our scripts will be calling to start up our application.

Create a server.js file and paste the following code:
```
// Import requirements
const http = require('http');
const app = require('./api/app');
const config = require('./config');

// Create the server
const server = http.createServer(app);

// Start listening at specified port
server.listen(config.port, (e) => {
    // Check if there are any errors
    if (e) {
        throw new Error('Internal Server Error');
    }
    // Log server is running
    console.log(`${config.name} running on ${config.url}`);
});
```

In this file we are requiring the `http` module from node.js in order to create the server using our `app` module previously created. As you probably noted already, we are also importing the `config` module we previously created as we will be using some of the variables here.

Finally, we begin listening to the defined port and consol.log that our server is running. Bare in mind that the port retrieved here is a port we defined in our config.js file which determines if the current server is ran locally or on the server, in which case it will start listening on the desired server based on the environment.

## Test your app
Right now we have a very basic boilerplate set up to start testing if our application is running successfully. 

Open up your terminal and run your app by typing `npm run dev` and watch the terminal log to see if it is in fact running on the desired host/port.

In the next part, we will be creating our authentication endpoints and logic to be able to authenticate users, using a very simple token based custom authentication system.

Happy coding :wink:,