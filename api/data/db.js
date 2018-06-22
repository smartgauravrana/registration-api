const mongoose = require('mongoose');
const dburl = 'mongodb://gaurav:vodafone8053@ds261660.mlab.com:61660/regapi';

mongoose.connect(dburl);

//CONNECTION EVENTS
mongoose.connection.on('connected',
 () => console.log('Mongoose connected to ' + dburl));

mongoose.connection.on('disconnected',
 () => console.log('Mongoose disconnected'));

mongoose.connection.on('error',
 (err) => console.log('Mongoose connection error: ' + err));

 //CAPTURE APP TERMINATION / RESTRART EVENTS
 //To be called when process is restarted pr terminated
 function gracefulShutdown(msg, callback) {
     mongoose.connection.close(() => {
         console.log('Mongoose disconnected through ' + msg);
         callback();
     });
 }

 //For nodemon restarts
 process.once('SIGUSR2', () => {
     gracefulShutdown('nodemon restart', 
     () => process.kill(process.pid, 'SIGUSR2') );
 });

 //For app termination
 process.on('SIGINT', () => {
     gracefulShutdown('App termination (SIGINT)',
    () => process.exit(0));
 });

 //For Heroku app termination
 process.on('SIGTERM', () => {
     gracefulShutdown('App termination (SIGTERM)',
    () => process.exit(0));
 });


 //BRING IN YOUR SCHEMA & MODELS
 require('./user.model');