const User = require('../Models/usersModel');
const codeFactory = require('../controllers/codeFactory')

//to show all User
exports.getAllusers = codeFactory.getAll(User)