const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const pool = require('../config');

module.exports.register = (req, res) => {
    const body = req.body;
    // console.log(body)
    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(body.password, salt);
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!body.email.match(regex)) {
        return res.status(400).json({
            success: false,
            message: 'enter valid email'
        })
    }
    // console.log(body.password)
    const name = `${body.fname} ${body.lname}`;
    pool.query('INSERT INTO user (email, password , name) VALUES (?, ?, ?)', [body.email, body.password, name], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong'
            });
        }
        // console.log(result);
        // Assuming sendTokenResponse is a function defined elsewhere
        sendTokenResponse(result, 200, res);
    });
}


module.exports.login = (req, res) => {
    const body = req.body;
    // console.log(body);
    pool.query('SELECT * FROM user WHERE email = ?', [body.email], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong'
            });
        }
        if (!results || results.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const user = results[0];
        const result = bcrypt.compareSync(body.password, user.password);
        if (result) {
            sendTokenResponse(user, 200, res);
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    });
}

module.exports.profile = (req, res) => {
    const email = req.query.email;
    console.log(email);
    pool.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Something went wrong'
            });
        }
        if (!results || results.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const user = results[0];
        delete user.password;
        res.status(200).json(user);
    });
}

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    const option = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };


    res.status(statusCode)
        .cookie('token', token, option)
        .json({
            message: "login success",
            success: true,
            token
        });
}