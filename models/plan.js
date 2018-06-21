'use strict';
module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define('Plan', {
    id       : {
      type         : DataTypes.INTEGER(11),
      field        : 'id',
      primaryKey   : true,
      autoIncrement: true,
      allowNull    : false,
      comment      : 'Plan id'
    },
    name     : {
      type        : DataTypes.STRING(256),
      field       : 'name',
      defaultValue: '',
      allowNull   : false,
      comment     : 'Plan name'
    },
    intro    : {
      type        : DataTypes.STRING(512),
      field       : 'intro',
      defaultValue: '',
      allowNull   : false,
      comment     : 'Plan introduction'
    },
    cost     : {
      type        : DataTypes.INTEGER(11),
      field       : 'cost',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'Plan cost'
    },
    startTime: {
      type     : DataTypes.DATE,
      field    : 'start_time',
      // defaultValue: 0,
      allowNull: false,
      comment  : 'Plan start time'
    },
    endTime  : {
      type     : DataTypes.DATE,
      field    : 'end_time',
      // defaultValue: 0,
      allowNull: false,
      comment  : 'Plan end time'
    },
    status   : {
      type        : DataTypes.INTEGER(11),
      field       : 'status',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'Plan status'
    }
  });

  Plan.associate = function (models) {
    models.Plan.belongsToMany(models.Spot, {
      through   : models.PlanSpot,
      foreignKey: 'planId',
      otherKey  : 'spotId'
    });
    models.Plan.belongsToMany(models.User, {
      through   : models.UserPlan,
      foreignKey: 'planId',
      otherKey  : 'userId'
    });
  };

  return Plan;
};