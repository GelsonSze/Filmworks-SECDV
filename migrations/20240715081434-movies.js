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
    queryInterface.createTable('movies', {
      movieID: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: function(){
          return uuidv4()
        },
        allowNull: false,
        primaryKey: true
      },
      image: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: false,
          notEmpty: true,
      },
      title: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: false,
          notEmpty: true
      },
      starring: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: false,
          notEmpty: true
      },
      synopsis: {
          type: Sequelize.DataTypes.STRING(512),
          allowNull: false,
          notEmpty: true
      },
      trailer: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: false,
          notEmpty: true
      },
      price: {
          type: Sequelize.DataTypes.FLOAT,
          allowNullL: false,
          notEmpty: true
      },
      quantity: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          notEmpty: true
      },
      start_date: {
          type: Sequelize.DataTypes.DATEONLY,
          allowNull: false,
          notEmpty: true
      },
      end_date: {
          type: Sequelize.DataTypes.DATEONLY,
          allowNull: false,
          notEmpty: true
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.NOW
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.NOW
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

    await queryInterface.dropTable('movies')
  }
};
