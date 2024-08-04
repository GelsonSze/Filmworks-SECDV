const winston = require('winston');
const {combine, timestamp, printf} = winston.format
const path = require('path')

winston.loggers.add('UserActivityLogger', {
    level: 'info',
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf((info) => `[${info.timestamp}] ${info.message}` )
    ),
    transports: [new winston.transports.File({filename: path.resolve(__dirname, "../logs/user_activity.log")})]
})

winston.loggers.add('RegistrationLogger', {
    level: 'info',
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf((info) => `[${info.timestamp}] ${info.message}` )
    ),
    transports: [new winston.transports.File({filename: path.resolve(__dirname, "../logs/registration.log")})]
})

winston.loggers.add('AuthenticationLogger', {
    level: 'info',
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf((info) => `[${info.timestamp}] ${info.message}` )
    ),
    transports: [new winston.transports.File({filename: path.resolve(__dirname, "../logs/authentication.log")})]
})

winston.loggers.add('TransactionLogger', {
    level: 'info',
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf((info) => `[${info.timestamp}] ${info.message}` )
    ),
    transports: [new winston.transports.File({filename: path.resolve(__dirname, "../logs/transaction.log")})]
})

winston.loggers.add('AdminLogger', {
    level: 'info',
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf((info) => `[${info.timestamp}] ${info.message}` )
    ),
    transports: [new winston.transports.File({filename: path.resolve(__dirname, "../logs/admin.log")})]
})

winston.loggers.add('DevLogger', {
    level: 'info',
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf((info) => `[${info.timestamp}] ${info.message}` )
    ),
    transports: [new winston.transports.Console()]
})