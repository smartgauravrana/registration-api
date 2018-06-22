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
            let token = jwt.sign({ username: user.username}, 's3cr3t', { expiresIn: 3600});

            User.findOneAndUpdate({username: user.username}, {$set : {'token' : token}}, {new : true},(err, doc) => {
                if(err) {
                    console.log(err);
                    res.status(400).json(err);
                } else {
                    res.status(200).json({
                        success: true,
                        token: token
                    });
                }
            });
               
        }
    });
};

module.exports.login = (req, res) => {
    console.log('Logging in user');
    
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({
        username: username
    }).exec((err, user) => {
        if(err) {
            console.log(err);
            res.status(400).json(err);
        } else if (user) {
            
            if (bcrypt.compareSync(password, user.password)) {
                console.log('User found', user);
                let token = jwt.sign({ username: user.username}, 's3cr3t', { expiresIn: 3600});
                User.findOneAndUpdate({username: user.username}, {$set : {'token' : token}}, {new : true},(err, doc) => {
                    if(err) {
                        console.log(err);
                        res.status(400).json(err);
                    } else {
                        res.status(200).json({
                            success: true,
                            token: token
                        });
                    }
                });
            } else{
                res.status(401).json('Unauthorized');
            }
        } else {
            res.status(200).json({
                success: false,
                message: 'User not exist'
            });
        }
    });

};

module.exports.logout = (req, res) => {
    console.log('log out the user');
    User.findOneAndUpdate({
        username: req.user
    }, {$unset: {token: 1}}, {new: true}, (err, doc) => {

        if(err) {
            console.log(err);
            res.status(400).json(err);
        } else {
            res.status(200).json({
                success : true, 
                message : 'Successfully logged out'
            });
        }
    });
}

module.exports.authenticate = (req, res, next) => {
    const headerExists = req.headers.authorization;
    if (headerExists) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, 's3cr3t', (error, decoded) => {
            if(error) {
                console.log(error);
                res.status(401).json('Unauthorized');
            } else {
                console.log('finding user')
                User.findOne({'username': decoded.username}, (err, user) => {
                    if(user) {
                    if (user.token != token)
				{
                    console.log('user.token != token');
                    res.json({success : false, message : 'Authentication failed'});
                    return;
				} }
			
                    console.log('calling next method');
                    req.user = decoded.username;
                    next();
				
                });
            }
        }); 
    } else {
        res.status(401).json('No token provided');
    }
};
