// Export the configuration module
module.exports = () => ({
    appName: 'express-sse-chat-example',
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres',
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
});