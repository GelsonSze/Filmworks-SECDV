module.exports = (sequelize, DataTypes) => {
    const sessions = sequelize.define("Session", {
        session_id: {
			type: DataTypes.STRING(32),
			primaryKey: true,
		},
        expires: DataTypes.DATE,
		data: DataTypes.TEXT
    })

    return sessions
}