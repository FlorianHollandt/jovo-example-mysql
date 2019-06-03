// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

require('dotenv').config();

module.exports = {
    logging: true,
 
    intentMap: {
       'AMAZON.StopIntent': 'END',
       'AMAZON.CancelIntent': 'END',
       'NoIntent': 'END',
    },
    db: {
        MySQL: {
            users: {
                tableName: 'users',
                primaryKeyColumn: 'userId',
                dataColumnName: 'userData',
            },
            scores: {
                tableName: 'scores',
                primaryKeyColumn: 'id',
                scoreColumnName: 'score',
            },
            connection: {
                connectionLimit : 5,
                debug: false,
                host: process.env.MYSQL_ADDR || 'localhost',
                port:  process.env.MYSQL_PORT || '9000',
                user: process.env.MYSQL_USER || 'user',
                password: process.env.MYSQL_PASSWORD || 'password',
                database: process.env.MYSQL_DATABASE || 'jovoapp',
            },
        },
    },
 };
 