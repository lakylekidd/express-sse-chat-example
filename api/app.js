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
}