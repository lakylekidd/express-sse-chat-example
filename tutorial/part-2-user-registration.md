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
        // We will add more code here
        throw new Error("Not implemented exception");
    }

    /**
     * Logs in an existing user
     */
    const login = (req, res, next) => {
        // We will add more code here
        throw new Error("Not implemented exception");
    }

    // Export the functions
    return { register, login };
}
```

In this controller a lot of things are happening. First of all we are wrapping the entire controller into an exported function which takes only one parameter, the db module. Then we are exporting the two functions of the controller as an object. 

We are wrapping the controller so that we can replace the db file should we need to test the controller's functions in the future.

The first method we are implementing is the generate token method. This method takes in the user id and username of the user and converts them into a jwt token. It is at this point where we decide what sort of information we would like to include in our token. For our chat app, the user id and username should suffice.

### Register Method Implementation
For the register method, we will need to retrieve the user details from the submit form. We will find this in the body of the request
```
const { username, password, password_confirmation } = req.body;
```

After we have retrieve them, we should perform some basic checks such as if the password and confirmation password match, if the username is valid etc. For now, the following should be enough for our purposes

```
// Check if passwords match
if (password !== password_confirmation) return res.status(400).send({
    message: "Password and confirmation passwords do not match!"
});

// Check if username is valid
if (username.length <= 2) return res.status(400).send({
    message: "Username is not valid!"
});
```

Once we verify all details are correct, we should create an object that matches the user model. In this case, we only need username and password. As a common practice, we should never store sensitive user information in a raw format on the database to prevent personal details from leaking should there be a breach. For this we shall use `bcryptjs` tool to hash the user password and store that hash in the database instead. This is not the most secure way of hashing a password, as there are more advanced methods out there, but for our simple chat app, this should suffice for now.

```
// Create the user account
const account = {
    username,
    password: bcrypt.hashSync(password, 10)
}
```

Sequelize has a very specific way of performing CRUD operations on the database. However, before we attempt to store the user in the database, we will be performing a very simple step of checking whether or not the user already exists, after that we proceed with storing the information in the database and return a status 201:

```
User.count({ where: { username: username } })
.then(count => {
    // Check if at least one account exists
    // with the specified username
    if (count > 0) return res.status(422).send({
        message: "Cannot create account!"
    });

    // If code reached this far
    // Perform registration
    User.create(account)
        .then(user => {
            // Remove password from user
            const { username, id } = user;
            // Return success with new user object
            return res.status(201).json({ username, id });
        })
        .catch(err => {
            // Cannot create user
            return next(err);
        })
})
.catch(err => {
    // Cannot create user
    return next(err);
})
```

### Login Method Implementation
For the login, we shall be retrieving the same information, only this time, naturally, we won't be retrieving a password confirmation field.

```
const { username, password } = req.body;
```

Once we do this, we must check if the username and password provided have been in fact provided. If not, then we immediatelly return a status 400 with a brief message to the user.

After performing a check to see if a user with the provided username exists indeed in our database, we proceed with, once again, hashing the provided password and comparing it to the one we have already in store in the database, using bcryptjs function `compareSync`.

After we've been assured they are indeed the same, we call the `generateToken` function we created earlier providing the user id and username, and return the generated token under the property `jwt`.

```
// Check if username and password exist
if (username && password) {
    // Find the usr based on username
    User
        .findOne({
            where: { username: username }
        })
        .then(user => {
            // Check if user was not found
            if (!user) {
                return res.status(400).send({
                    message: "A user with this username does not exist."
                });
            }

            // Hash provided password and compare
            const pwCorrect = bcrypt.compareSync(password, user.password);
            // Check if comparison returned true
            if (pwCorrect) {
                // Password was correct
                // Return a JWT token with the user id
                const token = generateToken(user.id, user.username);
                // Send back to client
                return res.send({
                    jwt: token
                })
            } else {
                // Password was not correct
                // Return 400
                return res.status(400).send({
                    message: "The password was incorrect."
                })
            }
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send({
                message: "Somethings went wrong. Please try again later!",
                error: err
            })
        })


} else {
    // Return invalid
    return res.status(400).send({
        message: "Please supply a valid email and password"
    })
}
```

## 6. Routing Implementation
With expressJS, defining routes is a very simple procedure. Currently, we will only be defining the routes we need for the user registration and the user login.

Under the api folder, create another file called `user.router.js` and paste the following code:
```
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
```

Since this module is only responsible for forwarding requests based on the route, it shouldn't include any other logic within it. This is why we defined all of our logic inside the controler file.

Again, this module exports a function that takes an argument for the db. It then requires the user controller and initializes it with the db file we retrieved. Following that we define a router variable that we can use to define our routes.

Pay attention to the defined url path. `/register` is actually incomplete. Since this file only defines user routes, we will assume that what comes behinde it is `/users` however we do not define it here, how is that?

Since we are exporting the router as a module, we will later on import it in our `app.js` file, where we will redirect all requests made to the `/users` path to our users router.

Inside the `app.js` file, we will be adding our routes just bellow the app initialization.

```
 // Instantiate app
const app = express();

// ----> New Code
// Import the routers
const userRouter = require('./user.router')(db);
...

```

and then, just after we have included our middlewares, we will apply the router.

```
...
// Apply middlewares
app.use(cors());
app.use(jsonParser);

// Apply the routers
app.use('/users', userRouter);
...
```

## Test your app 
Express and nodejs are very flexible when it comes to creating a server and implementing api routes and methods that interract with the database.

There are many methos that will help you manage and separate your code to become more efficient and promote testability. 

A very interesting and lightweight tool you can use is `httpie`, which will allow you to test your endpoints. You can also use `postman` which provides a friendlier UI.

In the next part, we will be implementing our server side events and chat logic along with the ability to store chat-rooms in the database along with the chat history.

Happy coding :wink:,