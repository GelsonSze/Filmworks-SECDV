/*
PHASE 2 & 3 
CCAPDEV S11
    Group Members: 
        Ng, Sherilyn Kaye
        Vizmanos, Julianne 
*/

const db = require('../database/models/db.js');
const Movie = require('../database/models/Movie.js');

db.connect();

/*
    creates an object
    containing prodid, prodname, pimages, priceBefore, priceNow, description, details, and reviews
*/
const movies = [
  {
    m_id: "00001",
    m_image: "../images/movie_posters/SPIDER-MAN-HOMECOMING.jpg",
    m_name: "SPIDERMAN: HOMECOMING",
    m_cast: "TOM HOLLAND, ZENDAYA, ROBERT DOWNEY JR.",
    m_synopsis: "Thrilled by his experience with the Avengers, young Peter Parker returns home to live with his Aunt May. Under the watchful eye of mentor Tony Stark, Parker starts to embrace his newfound identity as Spider-Man. He also tries to return to his normal daily routine -- distracted by thoughts of proving himself to be more than just a friendly neighborhood superhero. Peter must soon put his powers to the test when the evil Vulture emerges to threaten everything that he holds dear.",
    m_trailer: "https://youtu.be/n9DwoQ7HWvI",
    m_price: "500",
    ticket: [
      {
        "date": "2022-06-15T09:30:00",
        "quantity": 250
      },
      {
        "date": "2022-06-15T13:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-17T10:00:00",
        "quantity": 250
      },
      {
        "date": "2022-08-17T16:30:00",
        "quantity": 250
      }
    ],
  },
  {
    m_id: "00002",
    m_image: "../images/movie_posters/beauty_and_the_beast.jpg",
    m_name: "BEAUTY AND THE BEAST",
    m_cast: "EMMA WATSON, DAN STEVENS, LUKE EVANS",
    m_synopsis: "An arrogant prince is cursed to live as a terrifying beast until he finds true love. Strangely, his chance comes when he captures an unwary clockmaker, whose place is then taken by his bold and beautiful daughter Belle. Helped by the Beast's similarly enchanted servants, including a clock, a teapot and a candelabra, Belle begins to see the sensitive soul behind the fearsome facade. But as time runs out, it soon becomes obvious that Belle's cocky suitor Gaston is the real beast of the piece.",
    m_trailer: "https://youtu.be/e3Nl_TCQXuw",
    m_price: "500",
    ticket: [
      {
        "date": "2022-07-17T09:30:00",
        "quantity": 250
      },
      {
        "date": "2022-07-17T13:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-18T10:00:00",
        "quantity": 250
      },
      {
        "date": "2022-08-18T12:30:00",
        "quantity": 250
      }
    ],
  },
  {
    m_id: "00003",
    m_image: "../images/movie_posters/a_silent_voice.jpg",
    m_name: "A SILENT VOICE",
    m_cast: "SAORI HAYAMI, MIYU IRINO",
    m_synopsis: "When a grade school student with impaired hearing is bullied mercilessly, she transfers to another school. Years later, one of her former tormentors sets out to make amends.",
    m_trailer: "https://youtu.be/nfK6UgLra7g",
    m_price: "450",
    ticket: [
      {
        "date": "2022-08-18T12:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-18T13:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-19T10:00:00",
        "quantity": 250
      },
      {
        "date": "2022-08-19T16:30:00",
        "quantity": 250
      }
    ],
  },
  {
    m_id: "00004",
    m_image: "../images/movie_posters/your_name.jpg",
    m_name: "YOUR NAME",
    m_cast: "RYUNOSUKE KAMIKI, MONE KAMISHIRAISHI",
    m_synopsis: "Two teenagers share a profound, magical connection upon discovering they are swapping bodies. Things manage to become even more complicated when the boy and girl decide to meet in person.",
    m_trailer: "https://youtu.be/xU47nhruN-Q",
    m_price: "450",
    ticket: [
      {
        "date": "2022-08-15T19:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-15T20:45:00",
        "quantity": 250
      },
      {
        "date": "2022-08-20T10:00:00",
        "quantity": 250
      },
      {
        "date": "2022-08-20T16:30:00",
        "quantity": 250
      }
    ],
  },
  {
    m_id: "00005",
    m_image: "../images/movie_posters/aladdin.jpg",
    m_name: "ALADDIN",
    m_cast: "MENA MASSOUD, NAOMI SCOTT, WILL SMITH",
    m_synopsis: "Aladdin is a lovable street urchin who meets Princess Jasmine, the beautiful daughter of the sultan of Agrabah. While visiting her exotic palace, Aladdin stumbles upon a magic oil lamp that unleashes a powerful, wisecracking, larger-than-life genie. As Aladdin and the genie start to become friends, they must soon embark on a dangerous mission to stop the evil sorcerer, Jafar, from overthrowing young Jasmine's kingdom.",
    m_trailer: "https://youtu.be/foyufD52aog",
    m_price: "450",
    ticket: [
      {
        "date": "2022-08-15T09:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-15T13:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-17T10:00:00",
        "quantity": 250
      },
      {
        "date": "2022-08-17T16:30:00",
        "quantity": 250
      }
    ],
  },
  {
    m_id: "00006",
    m_image: "../images/movie_posters/la_la_land.jpg",
    m_name: "LA LA LAND",
    m_cast: "EMMA STONE, RYAN GOSLING",
    m_synopsis: "Sebastian and Mia are drawn together by their common desire to do what they love. But as success mounts they are faced with decisions that begin to fray the fragile fabric of their love affair, and the dreams they worked so hard to maintain in each other threaten to rip them apart.",
    m_trailer: "https://youtu.be/0pdqf4P9MB8",
    m_price: "550",
    ticket: [
      {
        "date": "2022-08-25T09:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-25T13:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-27T10:00:00",
        "quantity": 250
      },
      {
        "date": "2022-08-27T16:30:00",
        "quantity": 250
      }
    ],
  },
  {
    m_id: "00007",
    m_image: "../images/movie_posters/knives_out.jpg",
    m_name: "KNIVES OUT",
    m_cast: "ANA DE ARMAS, DANIEL CRAIG, CHRIS EVANS",
    m_synopsis: "The circumstances surrounding the death of crime novelist Harlan Thrombey are mysterious, but there's one thing that renowned Detective Benoit Blanc knows for sure -- everyone in the wildly dysfunctional Thrombey family is a suspect. Now, Blanc must sift through a web of lies and red herrings to uncover the truth.",
    m_trailer: "https://youtu.be/xi-1NchUqMA",
    m_price: "550",
    ticket: [
      {
        "date": "2022-09-15T09:30:00",
        "quantity": 250
      },
      {
        "date": "2022-09-15T13:30:00",
        "quantity": 250
      },
      {
        "date": "2022-09-17T10:00:00",
        "quantity": 250
      },
      {
        "date": "2022-09-17T16:30:00",
        "quantity": 250
      }
    ],
  },
  {
    m_id: "00008",
    m_image: "../images/movie_posters/crazy_rich_asians.jpg",
    m_name: "CRAZY RICH ASIANS",
    m_cast: "CONSTANCE WU, HENRY GOLDING",
    m_synopsis: "Rachel Chu is happy to accompany her longtime boyfriend, Nick, to his best friend's wedding in Singapore. She's also surprised to learn that Nick's family is extremely wealthy and he's considered one of the country's most eligible bachelors. Thrust into the spotlight, Rachel must now contend with jealous socialites, quirky relatives and something far, far worse -- Nick's disapproving mother.",
    m_trailer: "https://youtu.be/ZQ-YX-5bAs0",
    m_price: "550",
    ticket: [
      {
        "date": "2022-08-15T09:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-15T13:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-17T10:00:00",
        "quantity": 250
      },
      {
        "date": "2022-08-17T16:30:00",
        "quantity": 250
      }
    ],
  },
  {
    m_id: "00009",
    m_image: "../images/movie_posters/wonder_woman.jpg",
    m_name: "WONDER WOMAN",
    m_cast: "GAL GADOT, CHRIS PINE",
    m_synopsis: "Before she was Wonder Woman (Gal Gadot), she was Diana, princess of the Amazons, trained to be an unconquerable warrior. Raised on a sheltered island paradise, Diana meets an American pilot (Chris Pine) who tells her about the massive conflict that's raging in the outside world. Convinced that she can stop the threat, Diana leaves her home for the first time. Fighting alongside men in a war to end all wars, she finally discovers her full powers and true destiny.",
    m_trailer: "https://youtu.be/1Q8fG0TtVAY",
    m_price: "520",
    ticket: [
      {
        "date": "2022-08-25T09:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-25T13:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-27T10:00:00",
        "quantity": 250
      },
      {
        "date": "2022-08-27T16:30:00",
        "quantity": 250
      }
    ],
  },
  {
    m_id: "00010",
    m_image: "../images/movie_posters/howls_moving_castle.jpg",
    m_name: "HOWL'S MOVING CASTLE",
    m_cast: "TAKUYA KIMURA, CHIEKO BAISHO",
    m_synopsis: "Sophie has an uneventful life at her late father's hat shop, but all that changes when she befriends wizard Howl, who lives in a magical flying castle. However, the evil Witch of Waste takes issue with their budding relationship and casts a spell on young Sophie, which ages her prematurely. Now Howl must use all his magical talents to battle the jealous hag and return Sophie to her former youth and beauty.",
    m_trailer: "https://youtu.be/iwROgK94zcM",
    m_price: "520",
    ticket: [
      {
        "date": "2022-08-15T09:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-15T13:30:00",
        "quantity": 250
      },
      {
        "date": "2022-08-17T10:00:00",
        "quantity": 250
      },
      {
        "date": "2022-08-17T16:30:00",
        "quantity": 250
      }
    ],
  },

]

db.insertMany(Movie, movies, () => console.log('Movies inserted successfully'));