module.exports = (sequelize, DataTypes) => {
    const session = sequelize.define("sessions", {
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

    return session
}