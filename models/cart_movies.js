const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const cart_movies = sequelize.define("cart_movies", {
        cartID: {
            type: DataTypes.UUID,
            defaultValue: uuidv4(),
            allowNull: false,
            primaryKey: true
        },
        movieID: {
            type: DataTypes.UUID,
            defaultValue: uuidv4(),
            allowNull: false,
            primaryKey: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNullL: false,
            notEmpty: true
        }
    })

    return cart_movies
}