module.exports = (sequelize, DataTypes) => {
    const sessions = sequelize.define("sessions", {
        session_id: {
            type: DataTypes.STRING(32),
            allowNull: false,
            notEmpty: true,
        },
        expires: {
            type: DataTypes.DATE,
            allowNull: true,
            notEmpty: true
        },
        data: {
            type: DataTypes.TEXT,
            allowNull: true,
            notEmpty: true
        }
    })

    return sessions
}