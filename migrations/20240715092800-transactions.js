'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('transactions', {
      transactionID: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: function(){
          return uuidv4()
        },
        allowNull: false,
        primaryKey: true
      },
      title: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: false,
          notEmpty: true
      },
      date: {
          type: Sequelize.DataTypes.DATEONLY,
          allowNull: false,
          notEmpty: true
      },
      start_time: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: false,
          notEmpty: true,
      },
      end_time: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: false,
          notEmpty: true,
      },
      individual_price: {
          type: Sequelize.DataTypes.FLOAT,
          allowNullL: false,
          notEmpty: true
      },
      quantity_purchased: {
          type: Sequelize.DataTypes.INTEGER,
          allowNullL: false,
          notEmpty: true
      },
      total_price: {
          type: Sequelize.DataTypes.FLOAT,
          allowNullL: false,
          notEmpty: true
      },
      credit_card: {
          type: Sequelize.DataTypes.STRING(19),
          allowNull: false,
          notEmpty: true,
      },
      date_purchased: {
          type: Sequelize.DataTypes.DATE,
          defaultValue: Sequelize.DataTypes.NOW,
          allowNull: false,
          notEmpty: true
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('transactions')
  }
};
