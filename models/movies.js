module.exports = (sequelize, DataTypes) => {
    const movies = sequelize.define("movies", {
        movieID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
        }
    })

    movies.associate = function(models){
        movies.belongsToMany(models.carts, {through: 'cart_movies', foreignKey: 'movieID', otherkey: 'cartID'})
    }

    return movies
}