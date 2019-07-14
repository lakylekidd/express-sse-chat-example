// Import requirements
const http = require('http');
const config = require('./config');
const db = require('./db');

// Initialize the app using the database
const app = require('./api/app')(db);

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