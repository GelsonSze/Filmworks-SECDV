'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('time_slots', [
      {
        timeID: 0,
        start_time: "09:00 AM",
        end_time: "11:30 AM"
      },
      {
        timeID: 1,
        start_time: "12:00 PM",
        end_time: "02:30 PM"
      },
      {
        timeID: 2,
        start_time: "03:00 PM",
        end_time: "05:30 PM"
      },
      {
        timeID: 3,
        start_time: "06:00 PM",
        end_time: "08:30 PM"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('time_slots', null, {
      truncate: true,
      cascade: true
    })
  }
};
