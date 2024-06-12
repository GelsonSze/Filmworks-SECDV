module.exports = (sequelize, DataTypes) => {
    const movies = sequelize.define("movies", {
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

    return movies
}