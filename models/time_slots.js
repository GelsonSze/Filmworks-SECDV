module.exports = (sequelize, DataTypes) => {
    const time_slots = sequelize.define("time_slots", {
        timeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        start_time: {
            type: DataTypes.STRING(128),
            allowNull: false,
            notEmpty: true,
        },
        end_time: {
            type: DataTypes.STRING(128),
            allowNull: false,
            notEmpty: true,
        }
    }, { timestamps: false })

    time_slots.associate = function(models){
        time_slots.belongsToMany(models.movies, {through: 'movie_times', foreignKey: 'timeID', otherkey: 'movieID'})
    }

    return time_slots
}