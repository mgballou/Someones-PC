const passport = require('passport')
const User = require('../models/User')
const GoogleStrategy = require('passport-google-oauth2').Strategy

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK

    },

    async function (accessToken, refreshToken, profile, cb) {

        try {
            let user = await User.findOne({googleId: profile.id})
            // if it finds the user, user will be truthy, otherwise it will be undefined 
            if (user) {
                return cb(null, user)
            } else {
                user = await User.create({
                    name: profile.displayName,
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value
                })} 
                
            } catch (err) {

                return cb(err)
            
        }
    }

))

passport.serializeUser(function(user, cb){
    cb(null, user._id)
})

passport.deserializeUser(async function(userId, cb) {
    cb(null, await User.findById(userId))
})