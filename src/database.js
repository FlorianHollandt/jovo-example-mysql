
const _ = require('lodash');
const mysql = require('mysql');

const config = require('./config');

module.exports = {

    writeScore: function(score) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await mysql.createConnection(config.db.MySQL.connection);
                const query = connection.query(
                    `INSERT INTO ${
                        config.custom.dbTables.scores.tableName
                    } SET ?`,
                    [
                        {
                            [config.custom.dbTables.scores.scoreColumnName]: score,
                        },
                    ],
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(results);
                        connection.end();
                    }
                );
            }
            catch (e) {
                reject(e);
            }
        });
    },

    getNumberOfBetterScores: function(score) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await mysql.createConnection(config.db.MySQL.connection);
                const query = connection.query(
                    `SELECT COUNT (*) FROM ${
                        config.custom.dbTables.scores.tableName
                    } WHERE ${
                        config.custom.dbTables.scores.scoreColumnName
                    } >= ?`,
                    [score],
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(
                            _.get(results, "[0]['COUNT (*)']") || 0
                        );
                        connection.end();
                    }
                );
            }
            catch (e) {
                reject(e);
            }
        });
    },
};

