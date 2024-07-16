module.exports = (sequelize, DataTypes) => {
    const movie_times = sequelize.define("movie_times", {
        movieID: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        timeID: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        }
    }, {timestamps: false})

    return movie_times
}