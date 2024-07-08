module.exports = (sequelize, DataTypes) => {
    const bannedIPs = sequelize.define("bannedIPs", {
        banID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        IPAddress: {
            type: DataTypes.STRING(46),
            allowNull: false,
            notEmpty: true
        }
    })

    return bannedIPs
}