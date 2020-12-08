const getError = (errName, errMsg) => {
    // Returns an error object in the format expected from getFormattedErrors function.
    return {param: errName, msg: errMsg};
}

const getServerError = () => {
    return {param: 'serverError', msg: 'Something went wrong, try again!'};
}

const getFormattedErrors = (errorsList) => {
    // Receives errors list as [{'param': 'errorName', 'msg': 'error message'}, e.t.c] and
    // returns an errors object in the following format
    // {'errorName': 'message', 'errorName2': 'message2'}.
    const errors = {};

    for (const err of errorsList) {
        errors[err.param] = err.msg;
    }

    return errors;
}

const getFilterMinMaxValues = (stringValue) => {
    // Receives the filter min max values as a string in the following format 'min-max',
    // and returns the min and max values.
    const values = stringValue.split('-');
    return {min: parseInt(values[0]), max: parseInt(values[1])};
};


module.exports = {
    getError,
    getServerError,
    getFormattedErrors,
    getFilterMinMaxValues,
}
