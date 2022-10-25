const { Request, Response } = require('express');
const ApiClientError = require('./../../utils/ApiClientError');
const ErrorHandler = require('./../../utils/ErrorHandler');
const { Treasure, MoneyValue, sequelize, Sequelize: { QueryTypes, Op } } = require('./../../db/models');

/**
 * Validates latitude and longitude
 * @param {String} latitude
 * @param {String} longitude
 * @throws {ApiClientError}
 */
const validateLatLong = (latitude, longitude) => {
  if (!latitude) {
    ErrorHandler.throw('Latitude is required.');
  }

  if (!longitude) {
    ErrorHandler.throw('Longitude is required');
  }

  let _latitude = +latitude;
  let _longitude = +longitude;

  if (isNaN(_latitude)) {
    ErrorHandler.throw('Latitude should be a float number.');
  }

  if (isNaN(_longitude)) {
    ErrorHandler.throw('Longitude should be a float number.');
  }

  if (Math.abs(_latitude) > 90) {
    ErrorHandler.throw('Latitude should be in range between -90 and 90.');
  }

  if (Math.abs(_longitude) > 180) {
    ErrorHandler.throw('Longitude should be in range between -180 and 180.');
  }
};

/**
 * Validates prize value
 * @param {String} prize_value
 * @throws {ApiClientError}
 */
const validatePrizeValue = (prize_value) => {
  if (!/^[0-9]+$/.test(prize_value)) {
    ErrorHandler.throw('Prize value should be a whole number.');
  }

  if (+prize_value < 10 || +prize_value > 30) {
    ErrorHandler.throw('Prize value should be in range between 10 to 30.');
  }
}

/**
 * @api {GET} /api/treasures Get All Treasures
 * @apiName Get All Treasures
 * @apiGroup Treasure
 * @apiVersion 1.0.0
 *
 * @apiQuery  {Number}  latitude      The latitude of the treasure
 * @apiQuery  {Number}  longitude     The longitude of the treasure
 * @apiQuery  {Number=1,10}  distance      The distance in km to find treasure boxes within the latitude and longitude
 * @apiQuery  {Number{10-30}}  [prize_value] The prize value to filter the treasure boxes
 *
 * @apiSuccess (200)  {Object}  data  Treasure data
 * @apiSuccess (200)  {String}  message Action message
 *
 * @apiSampleRequest /api/treasures?latitude=14.552036595352455&longitude=121.01696118771324&distance=1
 *
 * @apiSuccessExample {Object}  Success-Response:
 * {
 *   "data": {
 *     "treasures": [
 *       {
 *         "id": 100,
 *         "name": "T1",
 *         "latitude": "14.54376481",
 *         "longitude": "121.01991168",
 *         "distance_in_km": 0.9730576519114664,
 *         "boxes": [
 *           {
 *             "id": 1,
 *             "treasure_id": 100,
 *             "amt": 15
 *           }
 *         ]
 *       },
 *       {
 *         "id": 102,
 *         "name": "T3",
 *         "latitude": "14.54464357",
 *         "longitude": "121.02036563",
 *         "distance_in_km": 0.9000314809778257,
 *         "boxes": [
 *           {
 *             "id": 3,
 *             "treasure_id": 102,
 *             "amt": 15
 *           }
 *         ]
 *       }
 *     ],
 *     "count": 2
 *   },
 *   "message": "Successfully retrieved treasures."
 * }
 */

/**
 * Handles getAll endpoint for Treasures
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @throws {ApiClientError}
 */
exports.getAll = async (req, res, next) => {
  try {
    let {
      latitude,
      longitude,
      distance,
      prize_value = undefined
    } = req.query;

    validateLatLong(latitude, longitude);

    if (!distance) {
      ErrorHandler.throw('Distance is required.')
    }

    if (!['1', '10'].includes(distance)) {
      ErrorHandler.throw('Distance should be either 1 or 10 in km.');
    }

    if (prize_value !== undefined) {
      validatePrizeValue(prize_value);
    }

    const RADIUS_OF_EARTH = 6371; // in km
    const PI = Math.PI / 180;
    const sql = `
      SELECT * FROM (SELECT treasures.*, (2 
        * ${RADIUS_OF_EARTH} 
        * ASIN(SQRT(0.5 - COS((treasures.latitude - ${latitude}) 
          * ${PI}) / 2 + COS(treasures.latitude * ${PI}) 
          * COS(${latitude} * ${PI}) 
          * (1 - COS((treasures.longitude - ${longitude}) * ${PI})) 
        / 2))) as distance_in_km 
      FROM treasures) t
          WHERE t.distance_in_km <= ${distance}
    `;

    let treasures = await sequelize.query(sql, { raw: true, type: QueryTypes.SELECT });
    treasures = await Promise.all(
      treasures.map(treasure =>
        new Promise(async (resolve, reject) => {
          try {
            const treasure_boxes = await sequelize.query(`
              SELECT * FROM money_values WHERE treasure_id = ${treasure.id}
                ${prize_value === undefined ? ` AND amt = (SELECT MIN(amt) FROM money_values WHERE treasure_id = ${treasure.id})` : ` AND amt >= ${prize_value}`}
            `, { raw: true, type: QueryTypes.SELECT });

            resolve({
              ...treasure,
              boxes: treasure_boxes
            });
          }
          catch(err) {
            reject(err);
          }
        })
      )
    )

    res.json({
      data: {
        treasures,
        count: treasures.length
      },
      message: 'Successfully retrieved treasures.'
    });
  }
  catch(err) {
    next(err);
  }
};

/**
 * @api {POST} /api/treasures Create Treasure
 * @apiName Create Treasure
 * @apiGroup Treasure
 * @apiVersion 1.0.0
 *
 * @apiBody {Number}  id        The id of the treasure
 * @apiBody {Number}  latitude  The latitude of the treasure
 * @apiBody {Number}  longitude The longitude of the treasure
 * @apiBody {String}  name      The name of the treasure
 *
 * @apiSuccess (200) {Object} data    Treasure data
 * @apiSuccess (200) {Object} message Action message
 *
 * @apiParamExample {Object} Request-Example:
 * {
 *   "id": 1000,
 *   "latitude": 14.166881,
 *   "longitude": 121.301323,
 *   "name": "Treasure 101"
 * }
 *
 * @apiSuccessExample {Object} Success-Response:
 * {
 *   "data": {
 *     "id": 1000,
 *     "latitude": 14.166881,
 *     "longitude": 121.301323,
 *     "name": "Treasure 101"
 *   },
 *   "message": "Successfully created a treasure."
 * }
 */

/**
 * Handles create endpoint for Treasure
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @throws {ApiClientError}
 */
exports.create = async (req, res, next) => {
  try {
    let { id, latitude, longitude, name } = req.body;

    if (!id) {
      ErrorHandler.throw('Treasure id is required.');
    }

    validateLatLong(latitude, longitude);

    if (!name) {
      ErrorHandler.throw('Treasure name is required.');
    }

    const count = await Treasure.count({
      where: {
        [Op.or]: [
          { id },
          { name }
        ]
      }
    });

    if (count > 0) {
      ErrorHandler.throw('Treasure name or id already exists.');
    }

    const treasure = await Treasure.create({
      id,
      latitude,
      longitude,
      name
    });

    res.json({
      data: treasure,
      message: 'Successfully created a treasure.'
    });
  }
  catch(err) {
    next(err);
  }
};

/**
 * @api {POST} /api/treasures/:treasure_id/boxes Create Treasure Box
 * @apiName Create Treasure Box
 * @apiGroup Treasure
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} treasure_id     The id of the treasure to put the treasure box into
 *
 * @apiBody {Number{10-30}} prize_value The prize value of the treasure box
 *
 * @apiSuccess (200) {Object} data    Treasure data
 * @apiSuccess (200) {String} message Action message
 *
 * @apiParamExample {Object}  Request-Example:
 * {
 *   "prize_value": 30
 * }
 *
 * @apiSuccessExample {Object} Success-Response:
 * {
 *   "data": {
 *     "id": 1000,
 *     "name": "Treasure 101",
 *     "latitude": "14.16688100",
 *     "longitude": "121.30132300",
 *     "box": [
 *       {
 *         "id": 29,
 *         "treasure_id": "1000",
 *         "amt": 30
 *       }
 *     ]
 *   },
 *   "message": "Successfully created a treasure box."
 * }
 */

/**
 * Handles create treasure box endpoint for Treasure
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @throws {ApiClientError}
 */
exports.createTreasureBox = async (req, res, next) => {
  try {
    const { treasure_id } = req.params;
    const { prize_value } = req.body;

    validatePrizeValue(prize_value);

    const treasure = await Treasure.findOne({
      where: {
        id: {
          [Op.eq]: treasure_id
        }
      }
    });

    if (!treasure) {
      ErrorHandler.throw('Treasure does not exists.', 404);
    }

    const box = await MoneyValue.create({
      treasure_id,
      amt: prize_value
    });

    const _treasure = treasure.toJSON();

    _treasure.box = [box];

    res.json({
      data: _treasure,
      message: 'Successfully created a treasure box.'
    })
  }
  catch(err) {
    next(err);
  }
};