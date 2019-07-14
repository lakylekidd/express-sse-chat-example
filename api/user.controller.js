// Export auth controller functions
module.exports = (db) => {
    // Import the User module
    const User = require('./user.model')(db);
    const jwt = require('./jwt.helper');

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
        // Retrieve the username and password and confirmation
        const { username, password, password_confirmation } = req.body;

        // Check if passwords match
        if (password !== password_confirmation) return res.status(400).send({
            message: "Password and confirmation passwords do not match!"
        });

        // Check if username is valid
        if (username.length > 2) return res.status(400).send({
            message: "Username is not valid!"
        });

        // Create the user account
        const account = {
            username,
            password: bcrypt.hashSync(password, 10)
        }

        // Check if user already exists
        // Not sure if it's alright to return a message
        // That informs user that this username is already taken
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
    }

    /**
     * Logs in an existing user
     */
    const login = (req, res, next) => {
        // Retrieve the username and password
        const { username, password } = req.body;
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
                    return res.status(500).send({
                        message: "Something went wrong. Please try again later!",
                        error: err
                    })
                })


        } else {
            // Return invalid
            return res.status(400).send({
                message: "Please supply a valid email and password"
            })
        }
    }

    // Export the functions
    return { register, login };
}