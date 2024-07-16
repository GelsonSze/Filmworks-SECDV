'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('banned_users', {
      userID: {
        type: Sequelize.DataTypes.UUID,
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

    await queryInterface.dropTable('banned_users')
  }
};
