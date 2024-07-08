module.exports = (sequelize, DataTypes) => {
    const reviews = sequelize.define("reviews", {
        reviewID: {
            type: DataTypes.UUID,
            defaultValue: sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
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

    reviews.associate = function(models){
        reviews.belongsTo(models.users, {foreignKey: 'userID'})
    }

    return reviews
}