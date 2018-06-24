'use strict';
module.exports = (sequelize, DataTypes) => {
  const Spot = sequelize.define('Spot', {
    id       : {
      type         : DataTypes.INTEGER(11),
      field        : 'id',
      primaryKey   : true,
      autoIncrement: true,
      allowNull    : false,
      comment      : 'Spot id'
    },
    name     : {
      type        : DataTypes.STRING(256),
      field       : 'name',
      defaultValue: '',
      allowNull   : false,
      comment     : 'Spot name'
    },
    intro    : {
      type        : DataTypes.STRING(512),
      field       : 'intro',
      defaultValue: '',
      allowNull   : false,
      comment     : 'Spot introduction'
    },
    cost     : {
      type        : DataTypes.INTEGER(11),
      field       : 'cost',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'Spot cost'
    },
    startTime: {
      type     : DataTypes.DATE,
      field    : 'start_time',
      // defaultValue: 0,
      allowNull: false,
      comment  : 'Spot start time'
    },
    endTime  : {
      type     : DataTypes.DATE,
      field    : 'end_time',
      // defaultValue: 0,
      allowNull: false,
      comment  : 'Spot end time'
    },
    location : {
      type     : DataTypes.GEOMETRY('POINT'),
      field    : 'location',
      allowNull: false,
      comment  : 'Spot location a geometry point'
    }
  });

  Spot.associate = function (models) {
    models.Spot.belongsToMany(models.Plan, {
      through   : models.PlanSpot,
      foreignKey: 'spotId',
      otherKey  : 'planId'
    });
  };

  return Spot;
};