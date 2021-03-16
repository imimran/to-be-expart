const Sequelize = require('sequelize')
const sequelize = new Sequelize('expartdb', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: false
  },
  logging: false,
  dialectOptions: {
    //useUTC: false, // for reading from database

  },
  timezone: '+06:00',
})

//import tables
const UserModel = require("../models/User");
const User = UserModel(sequelize, Sequelize);

const UserExtentionModel = require("../models/UserExtention");
const UserExtention = UserExtentionModel(sequelize, Sequelize);


//Define Relationship
User.hasMany(UserExtention, {
  onDelete: "CASCADE",
  foreignKey: "user_id",

});

/*Generating the database table. If we set force:true then each and every
 *time when we start our application all tables will be drop from the
 *database and regenerate new. So beware of it before using it.
 */

//connect Database
(async () => {
  await sequelize.sync({ force: false });
  console.log('Database Connected!')

})()

module.exports = { sequelize, User, UserExtention };