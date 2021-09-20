const LocalStrategy = require('passport-local').Strategy; // Local strategy
//const mongoose = require('mongoose') // To check the email & password matches
const bcrypt = require('bcryptjs') // To compare the hash to plain text

// Local user model
const User = require('../models/User')

// Local expert model
const Expert =require('../models/Expert')

module.exports = function (passport) {
    passport.use('local',
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'That email is not registered' })
                    }
                    // Match the password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err
                        
                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: 'Password incorrect' })
                        }
                    })
                })
                .catch(err => console.log(err))

                
        })
    )
    passport.use('expert-local',
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            Expert.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'That email is not registered' })
                    }
                    // Match the password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err
                        
                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: 'Password incorrect' })
                        }
                    })
                })
                .catch(err => console.log(err))
        })
    )
    
    // passport.serializeUser((user, done) => {
    //     done(null, user.id);
    // });

    // passport.deserializeUser((id, done) => {
    //     User.findById(id, (err, user) => {
    //         done(err, user);
    //     });
    // });

    passport.serializeUser((user, done) => {
        done(null,  { _id: user.id, role: user.isExpert });
    });
    
    passport.deserializeUser((obj, done) => {
        if(obj.role === true){
            Expert.findById(obj._id, (err, user) => {
                done(err, user);
            });
        }else if(obj.role === true){
            User.findById(obj._id, (err, user) => {
                done(err, user);
            });
        }
    });
}