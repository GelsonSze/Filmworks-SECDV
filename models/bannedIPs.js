const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const bannedIPs = sequelize.define("bannedIPs", {
        banID: {
            type: DataTypes.UUID,
            defaultValue: function(){
                return uuidv4()
            },
            allowNull: false,
            primaryKey: true
        },
        IPAddress: {
            type: DataTypes.STRING(46),
            allowNull: false,
            notEmpty: true
        },
        bannedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            notEmpty: true
        }
    }, {timestamps: false})

    return bannedIPs
}