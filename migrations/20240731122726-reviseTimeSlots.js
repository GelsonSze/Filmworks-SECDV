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

    await queryInterface.dropTable('movie_times')
    await queryInterface.dropTable('time_slots')
    await queryInterface.addColumn(
      'movies',
      'start_time',
      {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: false,
        notEmpty: true
      }
    )

    await queryInterface.addColumn(
      'movies',
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

    await queryInterface.createTable('movie_times', {
      movieID: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'movies',
          key: 'movieID'
        }
      },
      timeID: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        references: {
          model: 'time_slots',
          key: 'timeID'
        }
      }
    })

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

    await queryInterface.removeColumn('movies', 'start_time')
    await queryInterface.removeColumn('movies', 'end_time')
  }
};
