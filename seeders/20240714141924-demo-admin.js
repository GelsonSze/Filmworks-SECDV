'use strict';
const { v4: uuidv4 } = require('uuid');


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

    await queryInterface.bulkInsert('admins', [
      {
        adminID: uuidv4(),
        fullName: "Tetsu Kasuya",
        emailAddress: "tetsukasuya@gmail.com",
        phoneNumber: "09179578641",
        profilePhoto: "../uploads/profiles/paimonpf.jpg",
        password: "$2a$12$btFt4icZSquY/XqqT8/9.eYxNSX8PvtShAti/ea2oBo8mAqTaWLJO",
        permissionLevel: "read",
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date()
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

    await queryInterface.bulkDelete('admins', null, {
      truncate: true,
      cascade: true
    })
  }
};
