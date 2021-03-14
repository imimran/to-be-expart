"use strict";

module.exports = (sequelize, DataTypes) => {
  const UserExtention = sequelize.define(
    "bden_user_extention",
    {
      id : {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id  : {
        type: DataTypes.BIGINT(20),
        allowNull: false,
      },
      meta_key: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      meta_value : {
        type:  DataTypes.TEXT("long"),
        allowNull: true,
      },
    },
    {
      tableName: "bden_user_extention",
      timestamps: false,
    });

   return UserExtention;
  };



  

