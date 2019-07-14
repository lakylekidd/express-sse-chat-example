// Import required module
const jwt = require('jsonwebtoken');

// Export the functions
module.exports = (secret) => {
    /**
     * Converts some data into a JWT token
     * @param {any} data The data to convert
     */
    const toJwt = (data) => {
        return jwt.sign(data, secret, { expiresIn: '2h' })
    }
    /**
     * Translates a token back to data
     * @param {string} token The token to translate 
     */
    const toData = (token) => {
        return jwt.verify(token, secret);
    }
}