'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id    : {
      type         : DataTypes.INTEGER(11),
      field        : 'id',
      primaryKey   : true,
      autoIncrement: true,
      allowNull    : false,
      comment      : 'Group id'
    },
    name  : {
      type        : DataTypes.STRING(256),
      field       : 'name',
      defaultValue: '',
      allowNull   : false,
      comment     : 'Group name'
    },
    number: {
      type        : DataTypes.INTEGER(11),
      field       : 'number',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'Group member number'
    },
    intro : {
      type        : DataTypes.STRING(512),
      field       : 'intro',
      defaultValue: '',
      allowNull   : false,
      comment     : 'Group introduction'
    }
  });

  Group.associate = function (models) {
    //   add group and plan middle table!
    models.Group.belongsToMany(models.User, {
      through   : models.UserGroup,
      foreignKey: 'groupId',
      otherKey  : 'userId'
    });

    models.Group.belongsToMany(models.Plan, {
      through   : models.GroupPlan,
      foreignKey: 'groupId',
      otherKey  : 'planId'
    });
  };

  return Group;
};