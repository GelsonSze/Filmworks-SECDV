module.exports = (sequelize, DataTypes) => {
    const admins = sequelize.define("admins", {
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
        permissionLevel: {
            type: DataTypes.ENUM('read', 'read-write'),
            allowNull: false,
            notEmpty: true
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true
        }
    })

    return admins
}