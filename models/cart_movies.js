module.exports = (sequelize, DataTypes) => {
    const cart_movies = sequelize.define("cart_movies", {
        cartID: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        movieID: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            notEmpty: true
        }
    })
    
    return cart_movies
}