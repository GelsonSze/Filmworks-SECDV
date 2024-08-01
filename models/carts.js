const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const carts = sequelize.define("carts", {
        cartID: {
            type: DataTypes.UUID,
            defaultValue: function(){
                return uuidv4()
            },
            allowNull: false,
            primaryKey: true
        },
        userID: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
    })

    carts.associate = function(models){
        carts.belongsTo(models.users, {foreignKey: 'userID'});
        carts.belongsToMany(models.movies, {through: {model: models.cart_movies, unique:false, foreignKey: 'cartID', otherkey: 'movieID'}})
    }

    return carts
}