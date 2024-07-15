const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const transactions = sequelize.define("transactions", {
        transactionID: {
            type: DataTypes.UUID,
            defaultValue: uuidv4(),
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(256),
            allowNull: false,
            notEmpty: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            notEmpty: true
        },
        start_time: {
            type: DataTypes.STRING(128),
            allowNull: false,
            notEmpty: true,
        },
        end_time: {
            type: DataTypes.STRING(128),
            allowNull: false,
            notEmpty: true,
        },
        individual_price: {
            type: DataTypes.FLOAT,
            allowNullL: false,
            notEmpty: true
        },
        quantity_purchased: {
            type: DataTypes.INTEGER,
            allowNullL: false,
            notEmpty: true
        },
        total_price: {
            type: DataTypes.FLOAT,
            allowNullL: false,
            notEmpty: true
        },
        credit_card: {
            type: DataTypes.STRING(19),
            allowNull: false,
            notEmpty: true,
        },
        date_purchased: {
            type: DataTypes.DATE,
            allowNull: false,
            notEmpty: true
        }
    }, {timestamps: false})

    return transactions
}