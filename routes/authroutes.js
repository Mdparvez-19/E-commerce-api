// const passport = require('passport')
const router = require('express').Router();

// router.get('/forgotpassword' );

// const ensureAuthentication = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         res.locals.user = req.user;
//         return next()
//     } else
//     res.redirect('/auth/login')
// }
// router.get('/login', (req, res) => {
//     res.send('<a href ="/auth/google">login using google</a>')
// });

// router.get('/home', ensureAuthentication, (req, res) => {
//     res.send('hello')
// });

// router.get('/google', passport.authenticate('google', {
//     scope: ['profile', 'email']
// }));


// router.get('/google/redirect', passport.authenticate('google', {
//     failureRedirect: '/auth/login',
//     successRedirect: '/auth/home'
// }), (req, res) => {
//     res.send('call back URI..')
// })


module.exports = router;