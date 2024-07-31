module.exports = (sequelize, DataTypes) => {
    const movie_times = sequelize.define("movie_times", {
        movieID: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        timeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            notEmpty: true
        }
    }, {timestamps: false})

    return movie_times
}