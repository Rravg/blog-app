const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username }, (err, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (err, same) => {
                if (same) {
                    const infoMessage = 'Login Successfull';
                    req.flash('infoMessage', infoMessage);
                    req.session.userId = user._id;
                    res.redirect('/');
                } else {
                    const loginErrors = 'Incorrect Password';
                    req.flash('loginErrors', loginErrors);
                    res.redirect('/auth/login');
                }
            })
        } else {
            const loginErrors = 'User not Found';
            req.flash('loginErrors', loginErrors);
            res.redirect('/auth/login');
        }
    })
}