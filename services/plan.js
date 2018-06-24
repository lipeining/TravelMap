const db        = require('../models');
const BBPromise = require('bluebird');
const util      = require('util');

module.exports = {
  getPlans,
  getPlanUsers,
  getPlan,
  createPlan,
  updatePlan,
  updatePlans,
  delPlan,
  addUser,
  setUser,
  removeUser,
<<<<<<< HEAD
  getPlanGroups,
  addGroup,
  setGroup,
  removeGroup,
=======
>>>>>>> f7b67b92e950716c5803499b8260369e16da6924
};

async function getPlans(options) {
  let wherePlan = {};
  // search name and intro
  if (options.search) {
    wherePlan = {
      [db.Sequelize.Op.or]: [
        {
          name: {
            [db.Sequelize.Op.like]: '%' + options.search + '%'
          }
        },
        {
          intro: {
            [db.Sequelize.Op.like]: '%' + options.search + '%'
          }
        }
      ]
    };
  }
  // by now user just get the plans created by  himself!
  // wherePlan['userId'] = options.userId;
  // use plan->user by include.where about 0.22sec
  // use get user and then get the plans about 0.09sec.
  // or we get the plan from user.getPlans({})?

  // test through with where and
  // or we just find in UserPlan and then get the user and the plan !
  let user = await db.User.findOne({
    where: {id: options.userId}
  });
  // console.log(util.inspect(user, {depth: 4, color: true}));

  // use count to get the total number!
  let total = await user.countPlans({});

  let plans = await user.getPlans({
    where              : wherePlan,
    raw                : true,
    through            : {
      where: {
        status: 0,
        // type  : 0
      }
    },
    joinTableAttributes: ['createdAt', 'order', 'status', 'type'],
    offset             : (options.pageIndex - 1) * options.pageSize,
    limit              : options.pageSize,
    order              : [["id", "DESC"]]
  });
  return [plans, total];
  // return await db.Plan.findAndCountAll({
  //   attributes: ['id', 'name', 'intro', 'cost', 'status', 'startTime', 'endTime'],
  //   // required  : false,
  //   where     : wherePlan,
  //   raw       : true,
  //   offset    : (options.pageIndex - 1) * options.pageSize,
  //   limit     : options.pageSize,
  //   include   : [{
  //     model  : db.User,
  //     where  : {id: options.userId},
  //     required:false,
  //     through: {
  //       attributes: ['createdAt', 'order', 'status', 'type'],
  //     }
  //   }],
  //   order     : [["id", "DESC"]]
  // });
}

async function getPlan(options) {
<<<<<<< HEAD
  let plan   = await db.Plan.findOne({
    where: options
  });
  let Spots  = await plan.getSpots({
=======
  let plan  = await db.Plan.findOne({
    where: options
  });
  let Spots = await plan.getSpots({
>>>>>>> f7b67b92e950716c5803499b8260369e16da6924
    raw    : true,
    through: {
      attributes: ['order', 'status', 'type']
    }
  });
<<<<<<< HEAD
  let Users  = await plan.getUsers({
=======
  let Users = await plan.getUsers({
>>>>>>> f7b67b92e950716c5803499b8260369e16da6924
    raw       : true,
    attributes: {
      exclude: ['password']
    },
    through   : {
      attributes: ['order', 'status', 'type']
    }
  });
<<<<<<< HEAD
  let Groups = await plan.getGroups({
    raw    : true,
    through: {
      attributes: ['status', 'type']
    }
  });
  return [plan, Users, Spots, Groups];
=======
  return [plan, Users, Spots];
>>>>>>> f7b67b92e950716c5803499b8260369e16da6924
  // return await db.Plan.findOne({
  //   where     : options,
  //   attributes: ['id', 'name', 'intro', 'cost', 'status', 'startTime', 'endTime'],
  //   // required  : false,
  //   include   : [
  //     {
  //       model   : db.Spot,
  //       // attributes: [],
  //       through : {
  //         where     : {},
  //         attributes: ['order', 'status', 'type']
  //       },
  //       required: false
  //     },
  //     {
  //       model     : db.User,
  //       attributes: {
  //         exclude: ['password']
  //       },
  //       through   : {
  //         where     : {},
  //         attributes: ['order', 'status', 'type']
  //       },
  //       required  : false
  //     }]
  // });
}

async function createPlan(user, newPlan) {
  // http://docs.sequelizejs.com/class/lib/associations/belongs-to-many.js~BelongsToMany.html
  let userInstance = await db.User.findOne({where: {id: user.id}});
  return await userInstance.createPlan(
    newPlan, {
      through: {
        type: 0
        // try use default status = 0!
      }
    });
}

async function updatePlan(user, Plan) {
  return await db.Plan.update(Plan, {
    where: {id: Plan.id},
  });
}

async function updatePlans(Plans) {
  return db.sequelize.transaction(function (t) {
    // 在这里链接您的所有查询。 确保你返回他们。
    // take care of fields , make sure just update the order
    return BBPromise.each(Plans, function (Plan) {
      return db.Plan.update(Plan, {
        where      : {id: Plan.id},
        fields     : ['order'],
        transaction: t
      });
    });
  }).then(function (result) {
    // 事务已被提交
    // result 是 promise 链返回到事务回调的结果
  }).catch(function (err) {
    // 事务已被回滚
    // err 是拒绝 promise 链返回到事务回调的错误
  });
}

async function delPlan(Plan) {
  // not really delete the plan!
  return await db.Plan.update({
    status: 1
  }, {
    where: {id: Plan.id}
  });
}

async function getPlanUsers(options) {
  let whereUserPlan = {
    planId: options.planId
  };
  let userIds       = await db.UserPlan.findAll({
    where     : whereUserPlan,
    attributes: ['userId'],
    raw       : true
  }).map(function (UserPlan) {
    return UserPlan.userId;
  });
  // console.log(userIds);
  let whereUser     = {};
  if (options.inOut) {
    // find the user in the plan
    whereUser['id'] = {
      [db.Sequelize.Op.in]: userIds,
    };
  } else {
    // find the user not in the plan
    whereUser['id'] = {
      [db.Sequelize.Op.notIn]: userIds
    };
  }
  return await db.User.findAll({
    attributes: ['id', 'name'],
    raw       : true,
    where     : whereUser
  });
}

async function addUser(user, options) {
  // 1.check the user permission
  // 2.check type?
  // 3.get the userId (we can change it into array)
  // 4.use plan instance addUsers to add association!

  // user is optional , we can just use id!
  // let added = await db.User.findOne({
  //   where: {id: options.userId}
  // });
  let permission = await checkPlanOwner({
    userId: user.id,
    planId: options.id
  }) || {};
  if (permission.id) {
    let plan = await db.Plan.findOne({
      where: {id: options.id}
    });
    return await plan.addUsers(options.userIds, {
      through: {
        type  : options.type,
        status: options.status,
        // order : options.order, // by now , we ignore the order! todo
      }
    });
  } else {
    return Promise.reject('no permission to add user to this plan');
  }
}

async function setUser(user, options) {
  // 1.check the user permission
  // 2.check type?
  // 3.get the userId (we can change it into array)
  // 4.use plan instance addUsers to add association!

  // user is optional , we can just use id!
  // let added = await db.User.findOne({
  //   where: {id: options.userId}
  // });
  let permission = await checkPlanOwner({
    userId: user.id,
    planId: options.id
  }) || {};
  if (permission.id) {
    let plan = await db.Plan.findOne({
      where: {id: options.id}
    });
    // still use addUsers to update the type and status
    return await plan.addUsers([options.userId], {
      through: {
        type  : options.type,
        status: options.status,
        // order : options.order, // by now , we ignore the order! todo
      }
    });
  } else {
    return Promise.reject('no permission to set the user of this plan');
  }
}

async function removeUser(user, options) {
  // 1.check the user permission
  // 2.check type?
  // 3.use plan instance removeUsers to delete association!

  // user is optional , we can just use id!
  // let added = await db.User.findOne({
  //   where: {id: options.userId}
  // });
  let permission = await checkPlanOwner({
    userId: user.id,
    planId: options.id
  }) || {};
  if (permission.id) {
    let plan = await db.Plan.findOne({
      where: {id: options.id}
    });
    // still use addUsers to update the type and status
    return await plan.removeUsers([options.userId]);
  } else {
    return Promise.reject('no permission to remove the user of this plan');
  }
}

async function checkPlanOwner(options) {
  return await db.UserPlan.findOne({
    where     : {
      userId: options.userId,
      planId: options.planId,
      type  : 0,
      // status: 0,
    },
    attributes: ['id'],
    raw       : true
  });
}
<<<<<<< HEAD

async function getPlanGroups(options) {
  let whereGroupPlan = {
    planId: options.planId
  };
  let groupIds       = await db.GroupPlan.findAll({
    where     : whereGroupPlan,
    attributes: ['groupId'],
    raw       : true
  }).map(function (GroupPlan) {
    return GroupPlan.groupId;
  });

  let whereGroup = {};
  if (options.inOut) {
    // find the user in the plan
    whereGroup['id'] = {
      [db.Sequelize.Op.in]: groupIds,
    };
  } else {
    // find the user not in the plan
    whereGroup['id'] = {
      [db.Sequelize.Op.notIn]: groupIds
    };
  }
  return await db.Group.findAll({
    attributes: ['id', 'name', 'number'],
    raw       : true,
    where     : whereGroup
  });
}

async function addGroup(user, options) {
  // 1.check the user permission
  // 2.check type?
  // 3.get the userId (we can change it into array)
  // 4.use plan instance addUsers to add association!

  // user is optional , we can just use id!
  // let added = await db.User.findOne({
  //   where: {id: options.userId}
  // });
  let permission = await checkPlanOwner({
    userId: user.id,
    planId: options.planId
  }) || {};
  if (permission.id) {
    let plan    = await db.Plan.findOne({
      where: {id: options.planId}
    });
    // create the group and then add the users;
    let group   = await plan.createGroup({
      // here is the value object!
      name  : options.name,
      intro : options.intro,
      number: options.userIds.length,
    }, {
      through: {
        type  : options.type,
        status: options.status
      }
    });
    // how can we solve the group creator by type
    let creator = await group.addUsers([user.id], {
      through: {
        type  : 0,
        status: 0
      }
    });
    let users   = await group.addUsers(options.userIds, {
      through: {
        type  : 1,
        status: 0
      }
    });
    return true;
  } else {
    return Promise.reject('no permission to add group to this plan');
  }
}

async function setGroup(user, options) {
  // 1.check the user permission
  // 2.check type?
  // 3.get the userId (we can change it into array)
  // 4.use plan instance addUsers to add association!

  // user is optional , we can just use id!
  // let added = await db.User.findOne({
  //   where: {id: options.userId}
  // });
  let permission = await checkPlanOwner({
    userId: user.id,
    planId: options.planId
  }) || {};
  if (permission.id) {
    let plan = await db.Plan.findOne({
      where: {id: options.planId}
    });
    // still use addGroups to update the type and status
    return await plan.addGroups([options.groupId], {
      through: {
        type  : options.type,
        status: options.status
      }
    });
  } else {
    return Promise.reject('no permission to set the user of this plan');
  }
}

async function removeGroup(user, options) {
  // 1.check the user permission
  // 2.check type?
  // 3.use plan instance removeUsers to delete association!

  // user is optional , we can just use id!
  // let added = await db.User.findOne({
  //   where: {id: options.userId}
  // });
  let permission = await checkPlanOwner({
    userId: user.id,
    planId: options.id
  }) || {};
  if (permission.id) {
    let plan = await db.Plan.findOne({
      where: {id: options.id}
    });
    // still use addUsers to update the type and status
    return await plan.removeUsers([options.userId]);
  } else {
    return Promise.reject('no permission to remove the user of this plan');
  }
}

=======
>>>>>>> f7b67b92e950716c5803499b8260369e16da6924
