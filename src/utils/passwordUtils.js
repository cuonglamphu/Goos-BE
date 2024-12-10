// generate a random password for the new user 10 characters long
const generatePassword = () => {
    return Math.random().toString(36).substring(2, 15);
};

module.exports = { generatePassword };
