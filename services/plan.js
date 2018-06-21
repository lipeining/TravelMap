const db        = require('../models');
const BBPromise = require('bluebird');
const util      = require('util');

module.exports = {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  updatePlans,
  delPlan,
  addUser,
  setUser,
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
  return await user.getPlans({
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
  let plan  = await db.Plan.findOne({
    where: options
  });
  let Spots = await plan.getSpots({
    raw    : true,
    through: {
      attributes: ['order', 'status', 'type']
    }
  });
  let Users = await plan.getUsers({
    raw       : true,
    attributes: {
      exclude: ['password']
    },
    through   : {
      attributes: ['order', 'status', 'type']
    }
  });
  return [plan, Users, Spots];
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
  return await db.Plan.update(
    {
      status: 1
    }, {
      where: {id: Plan.id}
    });
}

async function addUser(user, options) {
  // 1.check the user permission todo
  // 2.check type?
  // 3.get the userId (todo we can change it into array)
  // 4.use plan instance addUsers to add association!

  // user is optional , we can just use id!
  // let added = await db.User.findOne({
  //   where: {id: options.userId}
  // });
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
}

async function setUser(user, options) {
  // 1.check the user permission todo
  // 2.check type?
  // 3.get the userId (todo we can change it into array)
  // 4.use plan instance addUsers to add association!

  // user is optional , we can just use id!
  // let added = await db.User.findOne({
  //   where: {id: options.userId}
  // });
  let plan = await db.Plan.findOne({
    where: {id: options.id}
  });
  // still use addUsers to update the type and status
  return await plan.addUsers(options.userIds, {
    through: {
      type  : options.type,
      status: options.status,
      // order : options.order, // by now , we ignore the order! todo
    }
  });
}
