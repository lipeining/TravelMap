'use strict';
module.exports = (sequelize, DataTypes) => {
  const PlanSpot = sequelize.define('PlanSpot', {
    id    : {
      type         : DataTypes.INTEGER(11),
      field        : 'id',
      primaryKey   : true,
      autoIncrement: true,
      allowNull    : false,
      comment      : 'PlanSpot id'
    },
    planId: {
      type        : DataTypes.INTEGER(11),
      field       : 'plan_id',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'plan id'
    },
    spotId: {
      type        : DataTypes.INTEGER(11),
      field       : 'spot_id',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'spot id'
    },
    order : {
      type        : DataTypes.INTEGER(11),
      field       : 'order',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'PlanSpot order'
    },
    status: {
      type        : DataTypes.INTEGER(11),
      field       : 'status',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'PlanSpot status'
    }
  });

  PlanSpot.associate = function (models) {
    // no need to !
  };

  return PlanSpot;
};