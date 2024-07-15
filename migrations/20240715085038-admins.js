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
    
    await queryInterface.createTable('admins', {
      adminID: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: uuidv4(),
        allowNull: false,
        primaryKey: true
      },
      fullName: {
          type: Sequelize.DataTypes.STRING(256),
          allowNull: false,
          notEmpty: true
      },
      emailAddress: {
          type: Sequelize.DataTypes.STRING(320),
          allowNull: false,
          unique: true,
          notEmpty: true,
      },
      phoneNumber: {
          type: Sequelize.DataTypes.STRING(12),
          allowNull: false,
          uniqe: true,
          notEmpty: true,
          len: [11, 12]
      },
      profilePhoto: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: false,
          notEmpty: true
      },
      password: {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: false,
          notEmpty: true,
          len: [8, 128]
      },
      permissionLevel: {
          type: Sequelize.DataTypes.ENUM('read', 'read-write'),
          allowNull: false,
          notEmpty: true
      },
      lastLogin: {
          type: Sequelize.DataTypes.DATE,
          allowNull: true
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

    await queryInterface.dropTable('admins')
  }
};
