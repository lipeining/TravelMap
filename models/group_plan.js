'use strict';
module.exports = (sequelize, DataTypes) => {
  const GroupPlan = sequelize.define('GroupPlan', {
    id    : {
      type         : DataTypes.INTEGER(11),
      field        : 'id',
      primaryKey   : true,
      autoIncrement: true,
      allowNull    : false,
      comment      : 'GroupPlan id'
    },
    planId: {
      type        : DataTypes.INTEGER(11),
      field       : 'plan_id',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'plan id'
    },
    groupId: {
      type        : DataTypes.INTEGER(11),
      field       : 'group_id',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'group id'
    },
    status: {
      type        : DataTypes.INTEGER(11),
      field       : 'status',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'GroupPlan status'
    },
    type  : {
      type        : DataTypes.INTEGER(11),
      field       : 'type',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'GroupPlan type'
    }
  });

  GroupPlan.associate = function (models) {
    // no need to !
  };

  return GroupPlan;
};