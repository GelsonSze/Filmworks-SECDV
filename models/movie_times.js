module.exports = (sequelize, DataTypes) => {
    const movie_times = sequelize.define("movie_times", {
        movieID: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        timeID: {
<<<<<<< HEAD
            // type: DataTypes.UUID,
            // defaultValue: uuidv4(),
            type: DataTypes.INTEGER,
=======
            type: DataTypes.UUID,
>>>>>>> d7b754bf9c86c76e87457824db060972a099f623
            allowNull: false,
            primaryKey: true
        }
    }, {timestamps: false})

    return movie_times
}