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

    await queryInterface.createTable('reviews', {
      reviewID: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: function(){
          return uuidv4()
        },
        allowNull: false,
        primaryKey: true
      },
      rating: {
          type: Sequelize.DataTypes.TINYINT(),
          allowNull: false,
          notEmpty: true,
      },
      description: {
          type: Sequelize.DataTypes.STRING(4096),
          allowNull: false,
          notEmpty: true
      },
      reviewer: {
          type: Sequelize.DataTypes.STRING(320),
          allowNull: false,
          notEmpty: true
      },
      userID: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: 'users',
          key: 'userID'
        }
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

    await queryInterface.dropTable('reviews')
  }
};
