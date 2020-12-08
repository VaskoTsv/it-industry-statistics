const {Router} = require('express');
const User = require('../models/User.js');
const Company = require('../models/Company.js');
const {getFormattedErrors} = require('../utils.js');
const {BaseUserSerializer} = require('../serializers/user.serializers.js');
const {
    USER_NOT_FOUND_ERROR,
    COMPANY_NOT_FOUND_ERROR,
    COMPANY_NOT_FOUND_IN_BOOKMARKS_ERROR,
    ALREADY_IN_BOOKMARKS_ERROR,
} = require('../constants.js');


const router = new Router();


// api/users/:userId - Get user data.
router.get('/:userId', async (req, res, next) => {
    const {userId} = req.params;

    const user = await User.findById(userId);
    let bookmarkedCompanies = [];

    if (!user) {
        return res.status(400).json({
            errors: getFormattedErrors([USER_NOT_FOUND_ERROR]),
        });
    }

    if (user.bookmarked_companies.length) {
        bookmarkedCompanies = await Company.find().where('_id').in(
            user.bookmarked_companies);
    }

    res.status(200).json(BaseUserSerializer(user, bookmarkedCompanies));
});


// api/users/:userId/bookmarked/:companyId - Add company to user's bookmarked companies.
router.put('/:userId/bookmarked/:companyId', async (req, res, next) => {
    const {userId, companyId} = req.params;

    const user = await User.findById(userId);
    const company = await Company.findById(companyId);

    if (!user || !company) {
        const errs = [];

        if (!user) errs.push(USER_NOT_FOUND_ERROR);
        if (!company) errs.push(COMPANY_NOT_FOUND_ERROR);

        return res.status(400).json({
            errors: getFormattedErrors(errs),
        });
    }

    const alreadyBookmarked = Boolean(
        user.bookmarked_companies.findIndex(cmp => String(cmp) === companyId) !== -1);

    if (alreadyBookmarked) {
        return res.status(400).json({
            errors: getFormattedErrors([ALREADY_IN_BOOKMARKS_ERROR]),
        });
    }

    await user.update({bookmarked_companies: [...user.bookmarked_companies, company]});

    return res.status(200).json({
        user,
        message: 'Added to bookmarks!'
    });
});


// api/users/:userId/bookmarked/:companyId - Remove company from user's bookmarked companies.
router.delete('/:userId/bookmarked/:companyId', async (req, res, next) => {
    const {userId, companyId} = req.params;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(400).json({
            errors: getFormattedErrors([USER_NOT_FOUND_ERROR]),
        });
    }

    const removeCandidatePosition = user.bookmarked_companies.findIndex(
        c => String(c) === companyId);

    if (removeCandidatePosition === -1) {
        return res.status(400).json({
            errors: getFormattedErrors([COMPANY_NOT_FOUND_IN_BOOKMARKS_ERROR]),
        });
    }

    user.bookmarked_companies.splice(removeCandidatePosition, 1);
    await user.update({bookmarked_companies: user.bookmarked_companies});

    let bookmarkedCompanies = [];
    if (user.bookmarked_companies.length) {
        bookmarkedCompanies = await Company.find().where('_id').in(
            user.bookmarked_companies);
    }

    return res.status(200).json({
        user: BaseUserSerializer(user, bookmarkedCompanies),
        message: 'Bookmark is removed successfully!'
    });
});


module.exports = router;
