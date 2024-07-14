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

    await queryInterface.bulkInsert('movies', [
      {
        movieID: uuidv4(),
        image: "../uploads/movies/a_silent_voice.jpg",
        title: "A SILENT VOICE",
        starring: "SAORI HAYAMI, MIYU IRINO",
        synopsis: "When a grade school student with impaired hearing is bullied mercilessly, she transfers to another school. Years later, one of her former tormentors sets out to make amends.",
        trailer: "https://youtu.be/nfK6UgLra7g",
        price: 250,
        quantity: 75,
        start_date: "2024-01-01",
        end_date: "2024-01-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        movieID: uuidv4(),
        image: "../uploads/movies/crazy_rich_asians.jpg",
        title: "CRAZY RICH ASIANS",
        starring: "CONSTANCE WU, HENRY GOLDING",
        synopsis: "Rachel Chu is happy to accompany her longtime boyfriend, Nick, to his best friend's wedding in Singapore. She's also surprised to learn that Nick's family is extremely wealthy and he's considered one of the country's most eligible bachelors. Thrust into the spotlight, Rachel must now contend with jealous socialites, quirky relatives and something far, far worse -- Nick's disapproving mother.",
        trailer: "https://youtu.be/ZQ-YX-5bAs0",
        price: 250,
        quantity: 75,
        start_date: "2024-01-14",
        end_date: "2024-01-28",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        movieID: uuidv4(),
        image: "../uploads/movies/howls_moving_castle.jpg",
        title: "HOWL'S MOVING CASTLE",
        starring: "TAKUYA KIMURA, CHIEKO BAISHO",
        synopsis: "Sophie has an uneventful life at her late father's hat shop, but all that changes when she befriends wizard Howl, who lives in a magical flying castle. However, the evil Witch of Waste takes issue with their budding relationship and casts a spell on young Sophie, which ages her prematurely. Now Howl must use all his magical talents to battle the jealous hag and return Sophie to her former youth and beauty.",
        trailer: "https://youtu.be/iwROgK94zcM",
        price: 250,
        quantity: 75,
        start_date: "2024-03-01",
        end_date: "2024-03-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        movieID: uuidv4(),
        image: "../uploads/movies/knives_out.jpg",
        title: "KNIVES OUT",
        starring: "ANA DE ARMAS, DANIEL CRAIG, CHRIS EVANS",
        synopsis: "The circumstances surrounding the death of crime novelist Harlan Thrombey are mysterious, but there's one thing that renowned Detective Benoit Blanc knows for sure -- everyone in the wildly dysfunctional Thrombey family is a suspect. Now, Blanc must sift through a web of lies and red herrings to uncover the truth.",
        trailer: "https://youtu.be/xi-1NchUqMA",
        price: 250,
        quantity: 75,
        start_date: "2024-03-14",
        end_date: "2024-03-28",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        movieID: uuidv4(),
        image: "../uploads/movies/your_name.jpg",
        title: "YOUR NAME",
        starring: "RYUNOSUKE KAMIKI, MONE KAMISHIRAISHI",
        synopsis: "Two teenagers share a profound, magical connection upon discovering they are swapping bodies. Things manage to become even more complicated when the boy and girl decide to meet in person.",
        trailer: "https://youtu.be/xU47nhruN-Q",
        price: 250,
        quantity: 75,
        start_date: "2024-05-01",
        end_date: "2024-05-14",
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

    await queryInterface.bulkDelete('movies', null, {
      truncate: true,
      cascade: true
    })
  }
};
