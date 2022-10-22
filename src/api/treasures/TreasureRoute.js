const express = require('express');
const Router = express.Router();

const TreasureController = require('./TreasureController');

Router.get('', TreasureController.getAll);
Router.post('', TreasureController.create);
Router.post('/:treasure_id/boxes', TreasureController.createTreasureBox);

module.exports = Router;