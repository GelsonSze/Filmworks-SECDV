module.exports = (sequelize, DataTypes) => {
    const admin = sequelize.define("admin", {
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
            type: DataTypes.BLOB,
            allowNull: false,
            notEmpty: true
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false,
            notEmpty: true,
            len: [8, 128]
        },
        dateCreated: {
            type: DataTypes.DATE,
            allowNull: false
        },
        lastUpdated: {
            type: DataTypes.DATE,
            allowNull: true
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: false
        },
        permissionLevel: {
            type: DataTypes.ENUM('read', 'read-write'),
            allowNull: false,
            notEmpty: true
        }
    })

    return admin
}