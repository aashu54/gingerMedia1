const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const pool = require('./config.js');
const userRouter = require('./routes/auth.js');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/user', userRouter);

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});
// Starting the server
const PORT = process.env.PORT || 3000; // Use the environment port if available, or use port 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
