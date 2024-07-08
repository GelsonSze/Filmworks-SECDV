module.exports = (sequelize, DataTypes) => {
    const reviews = sequelize.define("reviews", {
        rating: {
            type: DataTypes.TINYINT(),
            allowNull: false,
            notEmpty: true,
        },
        description: {
            type: DataTypes.STRING(4096),
            allowNull: false,
            notEmpty: true
        },
        reviewer: {
            type: DataTypes.STRING(320),
            allowNull: false,
            notEmpty: true
        }
    })

    return reviews
}