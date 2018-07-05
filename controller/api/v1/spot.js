const spotService = require('../../../services/spot');
const logService  = require('../../../services/log');
const fse         = require('fs-extra');
const path        = require('path');

const {validationResult} = require('express-validator/check');

module.exports = {
  getSpots,
  getSpot,
  createSpot,
  updateSpot,
  updateSpotLocation,
  delSpot,
};

async function getSpots(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let pageIndex = parseInt(req.query.pageIndex) || 1;
  let pageSize  = parseInt(req.query.pageSize) || 10;
  let options   = {
    pageIndex: pageIndex,
    pageSize : pageSize
  };
  if (req.query.search) {
    options['search'] = req.query.search;
  }
  try {
    // by now user just get the spot associated with  himself!
    // or other condition todo
    // options['userId']  = req.session.user.id;

    let spots = await spotService.getSpots(options);
    return res.json({Message: {spots: spots}, code: 0});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function getSpot(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    id: parseInt(req.query.id) || 0
  };
  try {
    // should we check the permission?
    let spot = await spotService.getSpot(options);
 
    return res.json({Message: {spot: spot}, code: 0});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}


async function createSpot(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let location = req.body.location || {};
  // Create a new point for location:
  const point = { 
    type       : 'Point',
    coordinates: [location.lng, location.lat]
  };

  let newSpot = {
    cost     : parseInt(req.body.cost) || 0,
    name     : req.body.name || '',
    intro    : req.body.intro || '',
    location : point,
    startTime: req.body.startTime,
    endTime  : req.body.endTime
  };
  try {
    let user  = req.session.user;
    let spot = await spotService.createSpot(user, newSpot);
    let log   = {
      admin: user,
      spot: spot,
      type : 11
    };
    if (spot.id) {
      log['success'] = 1;
      // logService.insertLog(log);
      return res.json({Message: {spot: spot}, code: 0});
    } else {
      log['success'] = 0;
      // logService.insertLog(log);
      return res.json({Message: {err: 'create spot error'}, code: 4});
    }
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function updateSpot(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let location = req.body.location || {};
  // Create a new point for location:
  const point = { 
    type       : 'Point',
    coordinates: [location.lng, location.lat]
  };

  let newSpot = {
    id       : parseInt(req.body.id) || 0,
    cost     : parseInt(req.body.cost) || 0,
    name     : req.body.name || '',
    intro    : req.body.intro || '',
    location : point,
    startTime: req.body.startTime,
    endTime  : req.body.endTime
  };

  try {
    // let spot  = await spotService.getSpot(options);
    let user  = req.session.user;
    let count = await spotService.updateSpot(user, newSpot);
    let log   = {
      admin: req.session.user,
      // spot   : spot,
      // options: options,
      type : 12
    };
    if (count) {
      log['success'] = 1;
      // logService.insertLog(log);
      return res.json({code: 0});
    } else {
      log['success'] = 0;
      // logService.insertLog(log);
      return res.json({Message: {err: 'wrong input'}, code: 4});
    }
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function updateSpotLocation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let location = req.body.location || {};
  // Create a new point for location:
  const point = { 
    type       : 'Point',
    coordinates: [location.lng, location.lat]
  };

  let newSpot = {
    id       : parseInt(req.body.id) || 0,
    location : point,
  };

  try {
    // let spot  = await spotService.getSpot(options);
    let user  = req.session.user;
    let count = await spotService.updateSpot(user, newSpot);
    let log   = {
      admin: req.session.user,
      // spot   : spot,
      // options: options,
      type : 12
    };
    if (count) {
      log['success'] = 1;
      // logService.insertLog(log);
      return res.json({code: 0});
    } else {
      log['success'] = 0;
      // logService.insertLog(log);
      return res.json({Message: {err: 'wrong input'}, code: 4});
    }
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function delSpot(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    id: parseInt(req.body.id) || 0
  };
  try {
    let count = await spotService.delSpot(options);
    let log   = {
      admin: req.session.user,
      // spot    : spot,
      type : 14
    };
    if (count) {
      log['success'] = 1;
      // logService.insertLog(log);
      return res.json({code: 0, Message: {}});
    } else {
      log['success'] = 0;
      // logService.insertLog(log);
      return res.json({Message: {err: 'wrong id'}, code: 4});
    }
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

