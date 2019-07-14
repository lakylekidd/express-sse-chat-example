# Part 2
In this part we will be focusing on creating a very basic custom user registration and token authorisation module and implement our first couple of routes a user will be able to use to register and login.

## 1. Install required modules
For this part we will require some additional modules. We will be using the following:
* PG
* Sequelize
* Jsonwebtoken
* BcryptJS

Open up your terminal and navigate to your root folder. Then type the following: 
```
npm i pg sequelize jsonwebtoken bcryptjs
```

## 2. Configuring the database
In this example we will be using a PostgreSQL Database. You can follow [this article ](https://www.2ndquadrant.com/en/blog/pginstaller-install-postgresql/) to set up a local database as this is outside of the scope of this article.

Once the database is set, you can update the database connection string in the `config.js` file:
```
// Define configuration variables
const connectionString = process.env.DATABASE_URL ||
    'database connection string here';
...
```

## 3. Create the JWT Helper
The JWT Helper is a module of two functions that allow conversion between regular user data properties and JWT token string.

Inside the api folder, create a `jwt.helper.js` file and paste the following:
```
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

    // Export module functions
    return { toJwt, toData };
}
```

In this file we are requiring the `jsonwebtoken` npm module which we will use to sign and verify our tokens.

Following that we are exporting a module which is a function that accepts a token secret, which is used to securely sign our tokens.

The `toJwt` function will accept the data we need to sign. This can be any form of data we wish, however, as a best practice, we need to keep our tokens as small in size as possible, providing only the necessary information. The function signs the data object with the provided secret and sets the token expiration time to 2 hours. After that we are returning the JWT token.

The `toData` function will accept a JWT token and verify it using the same secret provided during the module initialization.
> ***Note**: The secret must remain the same for all signed tokens. If the secret changes, then we will no longer be able to verify our tokens.*

## 4. Create User Model
In order to access and store the user data in the database, we need to create a user model which will act as a blueprint of each user. For this we will be using sequelize to define our model and work with it using some basic functions that will allow us to do just that.

Inside the api folder reate a `user.model.js` file and paste the following:
```
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
```

As with the previous files, the model too exports the entire user model as a nodeJS model. We first require sequelize and then we define the user model function that requires our db model as a parameter. We use this db model to define a user model. Our model is very simple so we will only define two fields, one for the username and one for the hashed password of the user.

Both of these fields are of type `sequelize.STRING` and they are not allowed to be null. In the second parameters of the `db.define` function, we specify the table name and whether or not we'll be using timestamps. Each record needs a unique ID in order to be identified, and for this, the ID is automatically specified by sequelize. 

Finally, we export the user model from the function.

## 5. Define the User registration and login functions
A very common MVC standard is to use controllers for actions specific to each model. For that we will be creating a controller specific for users and authentication.

Again, navigate to your api folder and create a `users.controller.js` file and paste the following:
```
// Export auth controller functions
module.exports = (db) => {
    // Import the User module
    const bcrypt = require('bcryptjs');
    const config = require('./../config');
    const User = require('./user.model')(db);
    const jwt = require('./jwt.helper')(config.jwtSecret);

    // Generates a new token
    const generateToken = (userId, username) => {
        return jwt.toJwt({
            userId: userId,
            username: username
        });
    }

    /**
     * Registers a new user in the database
     */
    const register = (req, res, next) => {
        throw new Error("Not implemented exception");
    }

    /**
     * Logs in an existing user
     */
    const login = (req, res, next) => {
        throw new Error("Not implemented exception");
    }

    // Export the functions
    return { register, login };
}
```