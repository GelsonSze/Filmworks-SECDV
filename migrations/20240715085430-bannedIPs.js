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

    await queryInterface.createTable('bannedIPs', {
      banID: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: function(){
          return uuidv4()
        },
        allowNull: false,
        primaryKey: true
      },
      IPAddress: {
          type: Sequelize.DataTypes.STRING(46),
          allowNull: false,
          notEmpty: true
      },
      bannedAt: {
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

    await queryInterface.dropTable('bannedIPs')
  }
};
