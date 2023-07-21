const router = require('express').Router();
const multer = require('multer');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const controller = require('./controller');

passport.use(new localStrategy({usernameField : 'email'}, controller.localStrategy));
router.post('/login', multer().none(), controller.login);
router.post('/register', multer().none(), controller.register);
router.get('/me', controller.me);
router.post('/logout', controller.logout);

module.exports = router;