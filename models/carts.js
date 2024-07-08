module.exports = (sequelize, DataTypes) => {
    const carts = sequelize.define("carts", {
        cartID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
    })

    carts.associate = function(models){
        carts.belongsTo(models.users, {foreignKey: 'userID'});
        carts.belongsToMany(models.movies, {through: 'cart_movies', foreignKey: 'cartID', otherkey: 'movieID'})
    }

    return carts
}