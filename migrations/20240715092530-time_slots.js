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
    await queryInterface.createTable('time_slots', {
      timeID: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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

    await queryInterface.dropTable('time_slots')
  }
};
