const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Downloads = sequelize.define('downloads', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    url: Sequelize.STRING

})

module.exports = Downloads;