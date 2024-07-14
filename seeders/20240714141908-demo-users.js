'use strict';
const { v4: uuidv4 } = require('uuid');
const carts = require('../models/carts');

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

    const generatedUserID = uuidv4()

    await queryInterface.bulkInsert('users', [
      {
        userID: generatedUserID,
        fullName: "Annoying Paimon",
        emailAddress: "annoyingpaimon@gmail.com",
        phoneNumber: "09877657821",
        profilePhoto: "../uploads/movies/paimonpf.jpg",
        password: "$2a$12$5zIGDdi43F1Gpj2SDLkf3eKb3/uvBUapjsYQ/V3e7VirsNxC5A1Ge", // PaimonPassword
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    await queryInterface.bulkInsert('carts', [
      {
        cartID: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userID: generatedUserID
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

    await queryInterface.bulkDelete('users', null, {
      truncate: true,
      cascade: true
    })
  }
};
