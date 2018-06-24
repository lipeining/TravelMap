'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define('UserGroup', {
    id     : {
      type         : DataTypes.INTEGER(11),
      field        : 'id',
      primaryKey   : true,
      autoIncrement: true,
      allowNull    : false,
      comment      : 'UserGroup id'
    },
    groupId: {
      type        : DataTypes.INTEGER(11),
      field       : 'group_id',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'group id'
    },
    userId : {
      type        : DataTypes.INTEGER(11),
      field       : 'user_id',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'user id'
    },
    status : {
      type        : DataTypes.INTEGER(11),
      field       : 'status',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'UserGroup status'
    },
    type   : {
      type        : DataTypes.INTEGER(11),
      field       : 'type',
      defaultValue: 0,
      allowNull   : false,
      comment     : 'UserGroup type'
    }
  });

  UserGroup.associate = function (models) {
    // no need to !
  };

  return UserGroup;
};