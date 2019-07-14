// Import required modules
const Sequelize = require('sequelize');

// Export the user model module
module.exports = (db) => {
    // Define a user model
    const User = db.define('user', {
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
            tableName: 'users',
            timestamps: false
        }
    );
    // Export the user model
    return User;
}