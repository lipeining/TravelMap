const groupService = require('../../../services/group');
const logService   = require('../../../services/log');
const fse          = require('fs-extra');
const path         = require('path');

const {validationResult} = require('express-validator/check');

module.exports = {
  getGroups,
  getGroupUsers,
  getGroup,
  createGroup,
  updateGroup,
  updateGroups,
  delGroup,
  addUser,
  setUser,
  removeUser,
};

async function getGroups(req, res, next) {
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
    // by now user just get the group associated with  himself!
    options['userId']   = req.session.user.id;
    let [groups, total] = await groupService.getGroups(options);
    return res.json({Message: {groups: groups, total: total}, code: 0});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function getGroup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    id: parseInt(req.query.id) || 0
  };
  try {
    // should we check the permission?
    let [group, Users, Plans] = await groupService.getGroup(options);
    // console.log(group);
    return res.json({
      Message: {
        group: group, Users: Users, Plans: Plans
      }, code: 0
    });
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function getGroupUsers(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  // get the user names which is in this group or not through inOut
  let options = {
    groupId: parseInt(req.query.groupId) || 0,
    inOut  : parseInt(req.query.inOut) || 0,
  };
  try {
    let userNames = await groupService.getGroupUsers(options);
    return res.json({Message: {userNames: userNames}, code: 0});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}

async function createGroup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let newGroup = {
    name  : req.body.name || '',
    intro : req.body.intro || '',
    number: 1
  };
  try {
    let user  = req.session.user;
    let group = await groupService.createGroup(user, newGroup);
    let log   = {
      admin: user,
      group: group,
      type : 11
    };
    if (group.id) {
      log['success'] = 1;
      // logService.insertLog(log);
      return res.json({Message: {group: group}, code: 0});
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

async function updateGroup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let newGroup = {
    id   : parseInt(req.body.id) || 0,
    name : req.body.name || '',
    intro: req.body.intro || ''
  };

  try {
    // let group  = await groupService.getGroup(options);
    let user  = req.session.user;
    let count = await groupService.updateGroup(user, newGroup);
    let log   = {
      admin: req.session.user,
      // group   : group,
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

//
async function updateGroups(req, res, next) {
  let groups = JSON.parse(req.body.groups) || [];
  try {
    // await groupService.updateGroups(groups);
    let log = {
      admin  : req.session.user,
      // groups  : groups,
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

async function delGroup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({Message: {err: errors.array()}, code: 4});
  }

  let options = {
    id: parseInt(req.body.id) || 0
  };
  try {
    // should delete the useless project logo and QR code

    // let group     = await groupService.getPlan(options);
    // let spots = await proService.getProjects({PlanId: options.id});
    // let spots = group.spots;

    // should we check who can delete the group?
    // todo check permission by UserGroup!
    let count = await groupService.delGroup(options);
    let log   = {
      admin: req.session.user,
      // group    : group,
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
    groupId: parseInt(req.body.groupId) || 0,
    userIds: req.body.userIds,
    type   : parseInt(req.body.type) || 0,
    status : parseInt(req.body.status) || 0,
  };
  try {
    // (todo we can change userId into array)
    let user   = req.session.user;
    let result = await groupService.addUser(user, options);
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
    groupId: parseInt(req.body.groupId) || 0,
    userId : parseInt(req.body.userId) || 0,
    type   : parseInt(req.body.type) || 0,
    status : parseInt(req.body.status) || 0,
  };
  try {
    // (todo we can change userId into array)
    let user   = req.session.user;
    let result = await groupService.setUser(user, options);
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
    groupId: parseInt(req.body.groupId) || 0,
    userId : parseInt(req.body.userId) || 0,
  };
  try {
    // (todo we can change userId into array)
    let user   = req.session.user;
    let result = await groupService.removeUser(user, options);
    return res.json({code: 0, Message: {}});
  } catch (err) {
    console.log(err);
    return res.json({Message: {err: err}, code: 4});
  }
}
