const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const banned_users = sequelize.define("banned_users", {
        userID: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        fullName: {
            type: DataTypes.STRING(256),
            allowNull: false,
            notEmpty: true
        },
        emailAddress: {
            type: DataTypes.STRING(320),
            allowNull: false,
            unique: true,
            notEmpty: true,
        },
        phoneNumber: {
            type: DataTypes.STRING(12),
            allowNull: false,
            uniqe: true,
            notEmpty: true,
            len: [11, 12]
        },
        profilePhoto: {
            type: DataTypes.STRING(128),
            allowNull: false,
            notEmpty: true
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false,
            notEmpty: true,
            len: [8, 128]
        },
        bannedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            notEmpty: true
        }
    }, {timestamps: false})

    return banned_users
}