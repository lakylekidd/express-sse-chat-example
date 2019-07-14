// Import required models
const Sequelize = require('sequelize');

// Export the database module
module.exports = (databaseUrl) => {
    // Create a new instance of sequelize
    const sequelize = new Sequelize(databaseUrl);

    // Sync the data (create schemas)
    sequelize.sync()
        .then(r => {
            // Log success
            console.log('Database schema created!');
        })
        .catch(console.log);

    // Return the sequelize database 
    return sequelize;
}