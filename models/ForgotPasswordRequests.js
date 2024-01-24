const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ForgotPassword = sequelize.define('ForgotPasswordRequests', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    isactive: Sequelize.BOOLEAN
})

module.exports = ForgotPassword;