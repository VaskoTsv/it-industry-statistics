const {getError} = require('./utils.js');
const {getServerError} = require('./utils.js');


const BG_INDUSTRY_ENDPOINT = 'https://www.bgindustrymap.com/api/companies/all?categories[]=2';

// The maximum allowed response size for ' api/company/list' request to be successful.
const MAX_RESPONSE_SIZE = 600;

const COMPANY_SIZE_OPTIONS = {
    Startup: '0-15',
    Small: '16-50',
    Medium: '51-100',
    Big: '101-300',
    Large: '301-10000',
};

const COMPANY_PROFIT_OPTIONS = {
    Broke: '0-0',
    Poor: '0-60000',
    Normal: '60000-200000',
    Rich: '200000-600000',
    'Very Rich': '600000-10000000',
};

const SERVER_ERROR = getServerError();
const SERVER_LIMIT_ERROR = getError('serverLimit',
    'There are too much results to be displayed!' +
    'Please make the search more specific by adding more filters!',
);
const USER_NOT_FOUND_ERROR = getError('user', 'There is no user registered with this email!');
const ALREADY_REGISTERED_ERROR = getError('user', 'There is already a registered user with this email!');
const WRONG_PASSWORD_ERROR = getError('password', 'Wrong password, try again!');
const COMPANY_NOT_FOUND_ERROR = getError('company', 'There is no company with this id!');
const ALREADY_IN_BOOKMARKS_ERROR = getError('bookmarks', 'Already added to bookmarks!');
const COMPANY_NOT_FOUND_IN_BOOKMARKS_ERROR = getError('bookmarks', 'No such company found in user bookmarks!')


module.exports = {
    BG_INDUSTRY_ENDPOINT,
    MAX_RESPONSE_SIZE,
    COMPANY_SIZE_OPTIONS,
    COMPANY_PROFIT_OPTIONS,
    SERVER_ERROR,
    SERVER_LIMIT_ERROR,
    USER_NOT_FOUND_ERROR,
    ALREADY_REGISTERED_ERROR,
    WRONG_PASSWORD_ERROR,
    COMPANY_NOT_FOUND_ERROR,
    ALREADY_IN_BOOKMARKS_ERROR,
    COMPANY_NOT_FOUND_IN_BOOKMARKS_ERROR,
}
