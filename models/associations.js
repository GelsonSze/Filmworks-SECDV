const users = require('./users')
const reviews = require('./reviews')
const carts = require('./carts')
const movies = require('./movies')

users.hasMany(reviews, { foreignKey: 'userID' })
reviews.belongsTo(users, { constraints: false })

users.hasOne(carts, { foreignKey: 'userID' });
carts.belongsTo(users, { foreignKey: 'userID', constraints: false });

movies.belongsToMany(carts, {through: 'cart_movies', constraints: false })
carts.belongsToMany(movies, {through: 'cart_movies'})