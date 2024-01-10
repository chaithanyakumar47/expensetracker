const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-practice', 'root', '*hQpgU}f!bY2', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;