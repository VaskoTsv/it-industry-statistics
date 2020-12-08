const User = require('../models/User.js');
const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const {getFormattedErrors} = require('../utils.js');
const {
    SERVER_ERROR,
    ALREADY_REGISTERED_ERROR,
    USER_NOT_FOUND_ERROR,
    WRONG_PASSWORD_ERROR,
} = require('../constants.js');


const router = Router();


// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Please enter valid email').isEmail(),
        check('password', 'The minimum password length is 6 symbols').isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: getFormattedErrors(errors.array()),
                });
            }

            const {email, password} = req.body;

            const candidate = await User.findOne({email});

            if (candidate) {
                return res.status(400).json({
                    errors: getFormattedErrors([ALREADY_REGISTERED_ERROR]),
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({email, password: hashedPassword});

            await user.save();

            res.status(201).json({message: 'User is created successfully'});
        } catch (e) {
            res.status(500).json({errors: getFormattedErrors([SERVER_ERROR])});
        }
    }
)


// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Please enter valid email').normalizeEmail().isEmail(),
        check('password', 'Please enter password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const errs = errors.array();

                return res.status(400).json({
                    errors: getFormattedErrors(errs),
                });
            }

            const {email, password} = req.body;

            const user = await User.findOne({email});

            if (!user) {
                return res.status(400).json({
                    errors: getFormattedErrors([USER_NOT_FOUND_ERROR]),
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    errors: getFormattedErrors([WRONG_PASSWORD_ERROR]),
                });
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            );

            res.json({token, userId: user.id});
        } catch (e) {
            res.status(500).json({
                errors: getFormattedErrors([SERVER_ERROR]),
            });
        }
    }
)


module.exports = router
