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
    await queryInterface.addColumn(
      'cart_movies',
      'date',
      {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: false,
        notEmpty: true
      }
    )

    await queryInterface.addColumn(
      'cart_movies',
      'start_time',
      {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: false,
        notEmpty: true
      }
    )

    await queryInterface.addColumn(
      'cart_movies',
      'end_time',
      {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: false,
        notEmpty: true,
      }
    )

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('cart_movies', 'date')
    await queryInterface.removeColumn('cart_movies', 'start_time')
    await queryInterface.removeColumn('cart_movies', 'end_time')
  }
};
