'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserPlan = sequelize.define('UserPlan', {
    id    : {
      type         : DataTypes.INTEGER(11),
      field        : 'id',
      primaryKey   : true,
      autoIncrement: true,
      allowNull    : false,
      comment      : 'UserPlan id'
    },
    planId: {
      type        : DataTypes.INTEGER(11),
      field       : 'plan_id',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'plan id'
    },
    userId: {
      type        : DataTypes.INTEGER(11),
      field       : 'user_id',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'user id'
    },
    order : {
      type        : DataTypes.INTEGER(11),
      field       : 'order',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'Plan order'
    },
    status: {
      type        : DataTypes.INTEGER(11),
      field       : 'status',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'UserPlan status'
    },
    type  : {
      type        : DataTypes.INTEGER(11),
      field       : 'type',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'UserPlan type'
    }
  });

  UserPlan.associate = function (models) {
    // no need to !
  };

  return UserPlan;
};