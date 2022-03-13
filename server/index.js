const express = require('express');

const cors = require('cors');
require('dotenv').config({ path: '.env' });

// app config
const app = express();
const port = process.env.PORT;

// import routes
const authRoutes = require('./routes/auth.routes');

// middlewares
app.use(cors());
app.use(express.json());
app.use(authRoutes);

// DB config
require('./database/connectDB');
// const userModel = require('./models/usermodel');

// API endpoints
app.get('/', (req, res) => {
	res.json("hello world");
})

// listener
app.listen(port, () => {
	console.log("Server running on PORT " + port);
});
