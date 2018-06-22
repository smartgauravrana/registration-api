const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

module.exports.register = (req, res) => {
    console.log('Registering the user');
    
    let username = req.body.username;
    let name = req.body.name || null;
    let password = req.body.password;

    User.create({
        username: username,
        name: name,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    }, (err, user) => {
        if(err) {
            console.log(err);
            res.status(400).json(err);
        } else{
            console.log('user created', user);
            res.status(201).json(user);
        }
    });
};

module.exports.login = (req, res) => {
    console.log('Login the user');
    console.log(req.body);
    res
    .status(200)
    .json(req.body);

};

module.exports.authenticate = (req, res, next) => {
    const headerExists = req.headers.authorization;
    if (headerExists) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, 's3cr3t', (error, decoded) => {
            if(error) {
                console.log(error);
                res.status(401).json('Unauthorized');
            } else {
                req.user = decoded.username;
                next();
            }
        }); 
    } else {
        res.status(401).json('No token provided');
    }
};