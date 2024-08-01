const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const movies = sequelize.define("movies", {
        movieID: {
            type: DataTypes.UUID,
            defaultValue: function(){
                return uuidv4()
            },
            allowNull: false,
            primaryKey: true
        },
        image: {
            type: DataTypes.STRING(128),
            allowNull: false,
            notEmpty: true,
        },
        title: {
            type: DataTypes.STRING(256),
            allowNull: false,
            notEmpty: true
        },
        starring: {
            type: DataTypes.STRING(256),
            allowNull: false,
            notEmpty: true
        },
        synopsis: {
            type: DataTypes.STRING(512),
            allowNull: false,
            notEmpty: true
        },
        trailer: {
            type: DataTypes.STRING(128),
            allowNull: false,
            notEmpty: true
        },
        price: {
            type: DataTypes.FLOAT,
            allowNullL: false,
            notEmpty: true
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            notEmpty: true
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            notEmpty: true
        }
    })

    movies.associate = function(models){
        movies.belongsToMany(models.carts, {through: {model: models.cart_movies, unique: false}, foreignKey: 'movieID', otherKey: 'cartID'})
        movies.belongsToMany(models.time_slots, {through: {model: models.movie_times, unique: false}, foreignKey: 'movieID', otherKey: 'timeID'})
        movies.belongsToMany(models.reviews, {through: {model: models.movie_reviews, unique:false}, foreignKey: 'movieID', otherKey: 'reviewID'})
    }

    return movies
}