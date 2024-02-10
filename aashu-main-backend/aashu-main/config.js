// config/dbConfig.js

const mysql = require('mysql');

const dbConfig = {
  host: 'sql6.freesqldatabase.com',
  user:'sql6682905',
  password: '3UugkbKB2Y',
  database:'sql6682905',
  port:3306
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
