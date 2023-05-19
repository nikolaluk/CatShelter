const homeHandler = require('./home');
const staticHandler = require('./static-files');
const catsHandler = require('./cat');

module.exports = [homeHandler, staticHandler, catsHandler];