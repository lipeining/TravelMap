const db        = require('../models');
const BBPromise = require('bluebird');
const util      = require('util');

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

async function getGroups(options) {
  let whereGroup = {};
  // search name and intro
  if (options.search) {
    whereGroup = {
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
  let user = await db.User.findOne({
    where: {id: options.userId}
  });

  // use count to get the total number!
  let total  = await user.countGroups({});
  let groups = await user.getGroups({
    where              : whereGroup,
    raw                : true,
    through            : {
      where: {
        status: 0,
        // type  : 0
      }
    },
    joinTableAttributes: ['createdAt', 'status', 'type'],
    offset             : (options.pageIndex - 1) * options.pageSize,
    limit              : options.pageSize,
    order              : [["id", "DESC"]]
  });
  return [groups, total];
}

async function getGroup(options) {
  let group = await db.Group.findOne({
    where: options
  });

  let Users = await group.getUsers({
    raw       : true,
    attributes: {
      exclude: ['password']
    },
    through   : {
      attributes: ['status', 'type']
    }
  });
  return [group, Users];
  // return await db.Group.findOne({
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

async function createGroup(user, newGroup) {
  // http://docs.sequelizejs.com/class/lib/associations/belongs-to-many.js~BelongsToMany.html
  let userInstance = await db.User.findOne({where: {id: user.id}});
  return await userInstance.createGroup(
    newGroup, {
      through: {
        type: 0
        // try use default status = 0!
      }
    });
}

async function updateGroup(user, Group) {
  return await db.Group.update(Group, {
    where: {id: Group.id},
  });
}

async function updateGroups(Groups) {
  return db.sequelize.transaction(function (t) {
    // 在这里链接您的所有查询。 确保你返回他们。
    // take care of fields , make sure just update the order
    return BBPromise.each(Groups, function (Group) {
      return db.Group.update(Group, {
        where      : {id: Group.id},
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

async function delGroup(Group) {
  // not really delete the group!
  return await db.Group.update({
    status: 1
  }, {
    where: {id: Group.id}
  });
}

async function getGroupUsers(options) {
  let whereUserGroup = {
    groupId: options.groupId
  };
  let userIds        = await db.UserGroup.findAll({
    where     : whereUserGroup,
    attributes: ['userId'],
    raw       : true
  }).map(function (UserGroup) {
    return UserGroup.userId;
  });
  // console.log(userIds);
  let whereUser      = {};
  if (options.inOut) {
    // find the user in the group
    whereUser['id'] = {
      [db.Sequelize.Op.in]: userIds,
    };
  } else {
    // find the user not in the group
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
  // 4.use group instance addUsers to add association!

  // user is optional , we can just use id!
  // let added = await db.User.findOne({
  //   where: {id: options.userId}
  // });
  let permission = await checkGroupOwner({
    userId : user.id,
    groupId: options.groupId
  }) || {};
  if (permission.id) {
    let group = await db.Group.findOne({
      where: {id: options.groupId}
    });
    return await group.addUsers(options.userIds, {
      through: {
        type  : options.type,
        status: options.status,
        // order : options.order, // by now , we ignore the order! todo
      }
    });
  } else {
    return Promise.reject('no permission to add user to this group');
  }
}

async function setUser(user, options) {
  // 1.check the user permission
  // 2.check type?
  // 3.get the userId (we can change it into array)
  // 4.use group instance addUsers to add association!

  // user is optional , we can just use id!
  // let added = await db.User.findOne({
  //   where: {id: options.userId}
  // });
  let permission = await checkGroupOwner({
    userId : user.id,
    groupId: options.groupId
  }) || {};
  if (permission.id) {
    let group = await db.Group.findOne({
      where: {id: options.groupId}
    });
    // still use addUsers to update the type and status
    return await group.addUsers([options.userId], {
      through: {
        type  : options.type,
        status: options.status,
        // order : options.order, // by now , we ignore the order! todo
      }
    });
  } else {
    return Promise.reject('no permission to set the user of this group');
  }
}

async function removeUser(user, options) {
  // 1.check the user permission
  // 2.check type?
  // 3.use group instance removeUsers to delete association!

  // user is optional , we can just use id!
  // let added = await db.User.findOne({
  //   where: {id: options.userId}
  // });
  let permission = await checkGroupOwner({
    userId : user.id,
    groupId: options.groupId
  }) || {};
  if (permission.id) {
    let group = await db.Group.findOne({
      where: {id: options.groupId}
    });
    // still use addUsers to update the type and status
    return await group.removeUsers([options.userId]);
  } else {
    return Promise.reject('no permission to remove the user of this group');
  }
}

async function checkGroupOwner(options) {
  return await db.UserGroup.findOne({
    where     : {
      userId : options.userId,
      groupId: options.groupId,
      type   : 0,
      // status: 0,
    },
    attributes: ['id'],
    raw       : true
  });
}
