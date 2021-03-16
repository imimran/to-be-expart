"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "bden_users",
    {

      id: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      user_status: {
        type: DataTypes.BIGINT(11),
        allowNull: false,
        defaultValue: '0'
      },
      display_name: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
    },
    {
      tableName: "bden_users",
      timestamps: false,
    });


  User.associate = models => {
    User.hasMany(models.UserExtention, {
      onDelete: "CASCADE",
      foreignKey: "user_id",
    });

  }

  return User;
}



