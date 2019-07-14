// Define configuration variables
const connectionString = process.env.DATABASE_URL ||
    'postgres://postgres:secret@localhost:5432/postgres';
const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

// Construct the url
const url = (process.env.NODE_ENV === 'production' ?
    host : `${host}:${port}`);

// Define a secret for the jwt token
const jwtSecret = process.env.JWT_SECRET || '(*FJKDOA#&U*(&u89e7fiUJ89vEIJ#89fIJGoy89erUG(*WRE)';

// Export the configuration module
module.exports = ({
    name: 'express-sse-chat-example',
    connectionString,
    port,
    host,
    url,
    jwtSecret
});