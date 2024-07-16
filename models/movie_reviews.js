module.exports = (sequelize, DataTypes) => {
    const movie_reviews = sequelize.define("movie_reviews", {
        movieID: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        reviewID: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        }
    })

    return movie_reviews
}