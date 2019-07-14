// Export the app module
module.exports = (db) => {
    // Import required modules
    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');

    // Instantiate app
    const app = express();

    // Import the routers
    const userRouter = require('./user.router')(db);

    // Define a body parser
    const jsonParser = bodyParser.json();

    // Apply middlewares
    app.use(cors());
    app.use(jsonParser);

    // Apply the routers
    app.use('/users', userRouter);

    // Return the app module
    return app;
}