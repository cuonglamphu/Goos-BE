const responseFormatter = (res, success, msg, data = null, error = null) => {
    try {
        const response = {
            success,
            msg,
            data,
            error,
        };
        return res.status(success ? 200 : error ? 500 : 400).json(response);
    } catch (error) {
        return error;
    }
};

module.exports = { responseFormatter };
