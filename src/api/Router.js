const express = require('express');
const Router = express.Router();

Router.use('/treasures', require('./treasures/TreasureRoute'));

module.exports = Router;