const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({email: email}); // buscando email en bd
    if (user) { // verificando si existe, en caso de true no lo guarda en bd y manda un mensaje
        return done(null, false, req.flash('error', 'Email ya existe'));
    } else { // si no existe lo guarda en bd 
        // Guardando user en bd
        const newUser = new User();
        newUser.email = email;
        newUser.password = await newUser.encryptPass(password);
        await newUser.save();
        done(null, newUser);
    }

}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({email: email}); // buscando email en bd
    if (!user) { // si coloca un user que no existe
        return done(null, false, req.flash('errorSignin', 'Usuario o email no encontrado'));
    }
    const match = await user.matchPass(password);
    if (!match) { // si coloca una pass que no existe
        return done(null, false, req.flash('errorSignin', 'Password incorrecto'));
    }
    done(null, user); // si todo ha ido ok lo loguea
}));