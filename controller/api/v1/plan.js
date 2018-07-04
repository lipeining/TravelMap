const planService = require('../../../services/plan');
const logService  = require('../../../services/log');
const fse         = require('fs-extra');
const path        = require('path');

const {validationResult} = require('express-validator/check');

module.exports = {
  getPlans, getPlan,
  getPlanUsers, createPlan, updatePlan, updatePlans, delPlan,
  addUser, setUser, removeUser,
  addGroup, setGroup, removeGroup, getPlanGroups,
  addSpot, setSpot, removeSpot, getPlanSpots,
};

async function getPlans(req, res, next) {
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
    // by now user just get the plans created by  himself!
    options['userId']  = req.session.user.id;
    let [plans, total] = await planService.getPlans(options);
    return res.json({Message: {plans: plans, total: total}, code: 0});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function getPlan(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    id: parseInt(req.query.id) || 0
  };
  try {

    let [plan, Users, Spots, Groups] = await planService.getPlan(options);
    // console.log(plan);
    return res.json({
      Message: {
        plan : plan, Users: Users,
        Spots: Spots, Groups: Groups
      }, code: 0
    });
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function getPlanUsers(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  // get the user names which is in this plan or not through inOut
  let options = {
    planId: parseInt(req.query.planId) || 0,
    inOut : parseInt(req.query.inOut) || 0,
  };
  try {
    let userNames = await planService.getPlanUsers(options);
    return res.json({Message: {userNames: userNames}, code: 0});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function createPlan(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let newPlan = {
    name     : req.body.name || '',
    intro    : req.body.intro || '',
    cost     : parseInt(req.body.cost) || 0,
    status   : parseInt(req.body.status) || 0,
    startTime: req.body.startTime,
    endTime  : req.body.endTime
  };
  try {
    let user = req.session.user;
    let plan = await planService.createPlan(user, newPlan);
    let log  = {
      admin: user,
      plan : plan,
      type : 11
    };
    if (plan.id) {
      log['success'] = 1;
      // logService.insertLog(log);
      return res.json({Message: {plan: plan}, code: 0});
    } else {
      log['success'] = 0;
      // logService.insertLog(log);
      return res.json({Message: {err: 'name already used'}, code: 4});
    }
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function updatePlan(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let newPlan = {
    id       : parseInt(req.body.id) || 0,
    name     : req.body.name || '',
    intro    : req.body.intro || '',
    cost     : parseInt(req.body.cost) || 0,
    status   : parseInt(req.body.status) || 0,
    startTime: req.body.startTime,
    endTime  : req.body.endTime
  };

  try {
    // let plan  = await planService.getPlan(options);
    let user  = req.session.user;
    let count = await planService.updatePlan(user, newPlan);
    let log   = {
      admin: req.session.user,
      // plan   : plan,
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

async function updatePlans(req, res, next) {
  let plans = JSON.parse(req.body.plans) || [];
  try {
    await planService.updatePlans(plans);
    let log = {
      admin  : req.session.user,
      // plans  : plans,
      type   : 13,
      success: 1
    };
    // logService.insertLog(log);
    return res.json({code: 0, Message: {}});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function delPlan(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    id: parseInt(req.body.id) || 0
  };
  try {
    // should delete the useless project logo and QR code

    // let plan     = await planService.getPlan(options);
    // let spots = await proService.getProjects({PlanId: options.id});
    // let spots = plan.spots;

    // should we check who can delete the plan?
    // todo check permission by UserPlan!
    let count = await planService.delPlan(options);
    let log   = {
      admin: req.session.user,
      // plan    : plan,
      // projects: projects,
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

async function addUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    id     : parseInt(req.body.id) || 0,
    userIds: req.body.userIds,
    type   : parseInt(req.body.type) || 0,
    status : parseInt(req.body.status) || 0,
  };
  try {
    // (todo we can change userId into array)
    let user   = req.session.user;
    let result = await planService.addUser(user, options);
    return res.json({code: 0, Message: {}});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function setUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    id    : parseInt(req.body.id) || 0,
    userId: parseInt(req.body.userId) || 0,
    type  : parseInt(req.body.type) || 0,
    status: parseInt(req.body.status) || 0,
  };
  try {
    // (todo we can change userId into array)
    let user   = req.session.user;
    let result = await planService.setUser(user, options);
    return res.json({code: 0, Message: {}});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function removeUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    id    : parseInt(req.body.id) || 0,
    userId: parseInt(req.body.userId) || 0,
  };
  try {
    // (todo we can change userId into array)
    let user   = req.session.user;
    let result = await planService.removeUser(user, options);
    return res.json({code: 0, Message: {}});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function getPlanGroups(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  // get the user names which is in this plan or not through inOut
  let options = {
    planId: parseInt(req.query.planId) || 0,
    inOut : parseInt(req.query.inOut) || 0,
  };
  try {
    let groupNames = await planService.getPlanGroups(options);
    return res.json({Message: {groupNames: groupNames}, code: 0});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function addGroup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    planId : parseInt(req.body.planId) || 0,
    userIds: req.body.userIds,
    type   : parseInt(req.body.type) || 0,
    status : parseInt(req.body.status) || 0,
    name   : req.body.name || '',
    intro  : req.body.intro || ''
  };
  try {
    // (todo we can change userId into array)
    let user   = req.session.user;
    let result = await planService.addGroup(user, options);
    return res.json({code: 0, Message: {result: result}});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function setGroup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    groupId: parseInt(req.body.groupId) || 0,
    planId : parseInt(req.body.planId) || 0,
    type   : parseInt(req.body.type) || 0,
    status : parseInt(req.body.status) || 0,
  };
  try {
    // (todo we can change userId into array)
    let user   = req.session.user;
    let result = await planService.setGroup(user, options);
    return res.json({code: 0, Message: {result: result}});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function removeGroup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    id     : parseInt(req.body.id) || 0,
    groupId: parseInt(req.body.groupId) || 0,
  };
  try {
    // (todo we can change userId into array)
    let user   = req.session.user;
    let result = await planService.removeGroup(user, options);
    return res.json({code: 0, Message: {}});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function getPlanSpots(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  // get the user names which is in this plan or not through inOut
  let options = {
    planId: parseInt(req.query.planId) || 0,
    inOut : parseInt(req.query.inOut) || 0,
  };
  try {
    let spotNames = await planService.getPlanSpots(options);
    return res.json({Message: {spotNames: spotNames}, code: 0});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function addSpot(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    planId   : parseInt(req.body.planId) || 0,
    cost     : parseInt(req.body.cost) || 0,
    type     : parseInt(req.body.type) || 0,
    status   : parseInt(req.body.status) || 0,
    name     : req.body.name || '',
    intro    : req.body.intro || '',
    location : req.body.location,
    startTime: req.body.startTime,
    endTime  : req.body.endTime
  };
  try {
    let user   = req.session.user;
    let result = await planService.addSpot(user, options);
    return res.json({code: 0, Message: {result: result}});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function setSpot(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    spotId: parseInt(req.body.spotId) || 0,
    planId: parseInt(req.body.planId) || 0,
    type  : parseInt(req.body.type) || 0,
    status: parseInt(req.body.status) || 0,
  };
  try {
    // (todo we can change userId into array)
    let user   = req.session.user;
    let result = await planService.setSpot(user, options);
    return res.json({code: 0, Message: {result: result}});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function removeSpot(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    id    : parseInt(req.body.id) || 0,
    spotId: parseInt(req.body.spotId) || 0,
  };
  try {
    // (todo we can change userId into array)
    let user   = req.session.user;
    let result = await planService.removeSpot(user, options);
    return res.json({code: 0, Message: {}});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}