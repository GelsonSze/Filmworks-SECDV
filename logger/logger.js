const winston = require('winston');
const {combine, timestamp, printf} = winston.format

winston.loggers.add('UserActivityLogger', {
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf((info) => `[${info.timestamp}] ${info.message}` )
    ),
    transports: new winston.transports.File({filename: '../logs/user_activity.log'})
})

winston.loggers.add('RegistrationLogger', {
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf((info) => `[${info.timestamp}] ${info.message}` )
    ),
    transports: new winston.transports.File({filename: '../logs/registration.log'})
})

winston.loggers.add('AuthenticationLogger', {
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf((info) => `[${info.timestamp}] ${info.message}` )
    ),
    transports: new winston.transports.File({filename: '../logs/authentication.log'})
})

winston.loggers.add('TransactionLogger', {
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf((info) => `[${info.timestamp}] ${info.message}` )
    ),
    transports: new winston.transports.File({filename: '../logs/transaction.log'})
})

winston.loggers.add('AdminLogger', {
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf((info) => `[${info.timestamp}] ${info.message}` )
    ),
    transports: new winston.transports.File({filename: '../logs/admin.log'})
})

winston.loggers.add('DevLogger', {
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf((info) => `[${info.timestamp}] ${info.message}` )
    ),
    transports: new winston.transports.Console()
})