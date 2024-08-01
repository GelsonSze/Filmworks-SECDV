const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const cart_movies = sequelize.define("cart_movies", {
        id:{
            type: DataTypes.UUID,
            defaultValue: function(){
                return uuidv4()
            },
            allowNull: false,
            primaryKey: true
        },
        cartID: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: false
        },
        movieID: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            notEmpty: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            notEmpty: true
        },
        start_time: {
            type: DataTypes.STRING(128),
            allowNull: false,
            notEmpty: true
        },
        end_time: {
            type: DataTypes.STRING(128),
            allowNull: false,
            notEmpty: true
        }
    })
    
    return cart_movies
}