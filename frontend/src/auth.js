const express = require('express');
const router = express.Router();

const { signup, signin } = require('../controllers/authController');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/signin');
    }
}

router.post('/signup', signup);

router.post('/signin', signin);

router.use(isAuthenticated);

module.exports = router;