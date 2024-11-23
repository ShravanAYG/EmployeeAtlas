const mariadb = require('mariadb');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt'); // Use bcrypt for password hashing

// Create pool connection to MariaDB
const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'uiUHJI#48795!',
    database: 'nodelogin',
    connectionLimit: 5
});

// Create Express app
const app = express();

// Session middleware configuration
app.use(session({
    secret: 'your-secure-secret', // Change to a stronger secret
    resave: false, // Set to false to avoid unnecessary resaving
    saveUninitialized: false, // Set to false to avoid storing empty sessions
    cookie: {
        httpOnly: true, // Helps prevent cross-site scripting (XSS)
        secure: false,  // Set to true if using https
        maxAge: 3600000 // 1 hour expiration time for session
    }
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for serving images, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'static')));

// Render login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle login authentication
app.post('/auth', async (req, res) => {
    const { username, password } = req.body;

    // Ensure the input fields exist and are not empty
    if (username && password) {
        try {
            // Query the database for the user
            const results = await pool.query('SELECT * FROM accounts WHERE username = ?', [username]);

            // If user exists, compare password with hashed version
            if (results.length > 0) {
                const user = results[0];
                
                // Compare password with hashed password
                const isMatch = await bcrypt.compare(password, user.password);
                
                if (isMatch) {
                    // Set session variables on successful login
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect('/home');
                } else {
                    res.sendFile(__dirname + "/kk.html");
                }
            } else {
                res.sendFile(__dirname + "/kk.html");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(400).send('Please enter Username and Password!');
    }
});

// Handle home page, only accessible if logged in
app.get('/home', function(request, response) {
        // If the user is loggedin
        if (request.session.loggedin) {
                // Output username
                response.send('Welcome back, ' + request.session.username + '!');
        } else {
                // Not logged in
                response.send('Please login to view this page!');
        }
        response.end();
});


// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

