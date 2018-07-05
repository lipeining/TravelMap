const db   = require('../models');
const util = require('util');

module.exports = {
  getSpots,
  getSpot,
  createSpot,
  updateSpot,
  delSpot,
};

async function getSpots(options) {
  let whereSpot = {};
  // search name and intro
  if (options.search) {
    whereSpot = {
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

  return await db.Spot.findAndCountAll({
    where : whereSpot,
    raw   : true,
    offset: (options.pageIndex - 1) * options.pageSize,
    limit : options.pageSize,
    order : [["id", "DESC"]]
  });
  
}

async function getSpot(options) {
  return await db.Spot.findOne({
    where: options
  });
}

async function createSpot(user, newSpot) {
  // http://docs.sequelizejs.com/class/lib/associations/belongs-to-many.js~BelongsToMany.html
  let userInstance = await db.User.findOne({where: {id: user.id}});
  return await userInstance.createSpot(
    newSpot, {
      through: {
        type: 0
        // try use default status = 0!
      }
    });
}

async function updateSpot(user, Spot) {
  return await db.Spot.update(Spot, {
    where: {id: Spot.id},
  });
}

async function delSpot(Spot) {
  // delete is not provide now!
  // should check permission!
  return true;
  // return await db.Spot.update({
  //   status: 1
  // }, {
  //   where: {id: Spot.id}
  // });
}

async function checkSpotOwner(options) {
  // now user spot , use other method！
  // return await db.UserSpot.findOne({
  //   where     : {
  //     userId : options.userId,
  //     SpotId: options.SpotId,
  //     type   : 0,
  //   },
  //   attributes: ['id'],
  //   raw       : true
  // });
}