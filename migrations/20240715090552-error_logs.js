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

    await queryInterface.createTable('error_logs',{
      id:{
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      origin: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        notEmpty: true
      },
      message: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          unique: true,
          notEmpty: true,
      },
      createdAt: {
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
    await queryInterface.dropTable('error_logs')
  }
};
