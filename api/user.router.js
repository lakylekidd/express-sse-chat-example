// Import the required modules
const { Router } = require('express');

// Export the user router module
module.exports = (db) => {
    // Import the required controller
    const userController = require('./user.controller')(db);
    // Initialize the router
    const router = Router();

    // Define the Register route
    router.post('/register', userController.register);

    // Define the Login route
    router.post('/token', userController.login);

    // Return the router
    return router;
}