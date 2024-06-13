module.exports = (sequelize, DataTypes) => {
    const bannedIPs = sequelize.define("bannedIPs", {
        IPAddress: {
            type: DataTypes.STRING(46),
            allowNull: false,
            notEmpty: true
        }
    })

    return bannedIPs
}