const BaseUserSerializer = (user, bookmarkedCompanies) => {
    return {
        _id: user._id,
        email: user.email,
        bookmarked_companies: bookmarkedCompanies,
    }
}


module.exports = {
    BaseUserSerializer,
}
