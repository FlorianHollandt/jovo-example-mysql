
const _ = require('lodash');
const mysql = require('mysql');

const config = require('./config');

module.exports = {
    createPool: function() {
        return mysql.createPool(config.db.MySQL.connection);
    },

    writeScore: function(score, pool) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(pool);
                // Use the connection
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
                        connection.release();
                    }
                );
            }
            catch (e) {
                reject(e);
            }
        });
    },

    getNumberOfBetterScores: function(score, pool) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(pool);
                // Use the connection
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
                        connection.release();
                    }
                );
            }
            catch (e) {
                reject(e);
            }
        });
    },
};

function getConnection(pool) {
    return new Promise(
        (resolve, reject) => {
            if (!pool) {
                throw new Error('Connection could not be established.');
            }
            pool.getConnection(
                (err, connection) => {
                    if (err) {
                        return reject(new Error(err.message));
                    }
                    resolve(connection);
                }
            );
        }
    );
}
