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
  logging: false,
  dialectOptions: {
    //useUTC: false, // for reading from database
   
  },
  timezone: '+06:00',
})

module.exports = sequelize;