const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const movie_reviews = sequelize.define("movie_reviews", {
        movieID: {
            type: DataTypes.UUID,
            defaultValue: uuidv4(),
            allowNull: false,
            primaryKey: true
        },
        reviewID: {
            type: DataTypes.UUID,
            defaultValue: uuidv4(),
            allowNull: false,
            primaryKey: true
        }
    })

    return movie_reviews
}