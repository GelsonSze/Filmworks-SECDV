module.exports = (sequelize, DataTypes) => {
    const error_logs = sequelize.define("error_logs", {
        id:{
            type: DataTypes.INTEGER, 
            primaryKey: true,
            allowNull: false,
            notEmpty: true,
            autoIncrement: true
        },
        origin: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            notEmpty: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            notEmpty: true
        }
    }, { timestamps: false })

    return error_logs
}