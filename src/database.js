
const mysql = require('mysql');

const config = require('./config');

module.exports = {
    writeScore: async function(score) {
        return new Promise(async (resolve, reject) => {
            try {
                const pool = mysql.createPool(config.db.MySQL.connection);
                const connection = await getConnection(pool);
                // Use the connection
                const query = connection.query(
                    `INSERT INTO ${
                        config.db.MySQL.scores.tableName
                    } SET ?`,
                    [
                        {
                            [config.db.MySQL.scores.scoreColumnName]: score,
                        },
                    ],
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        try {
                            resolve(results);
                        }
                        catch (e) {
                            reject(e);
                        }
                        connection.release();
                        pool.end()
                    }
                );
            }
            catch (e) {
                reject(e);
            }
        });
    },

    getNumberOfBetterScores: async function(score) {
        return new Promise(async (resolve, reject) => {
            try {
                const pool = mysql.createPool(config.db.MySQL.connection);
                const connection = await getConnection(pool);
                // Use the connection
                const query = connection.query(
                    `SELECT COUNT (*) FROM ${
                        config.db.MySQL.scores.tableName
                    } WHERE ${
                        config.db.MySQL.scores.scoreColumnName
                    } >= ?`,
                    [score],
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        try {
                            resolve(results[0]['COUNT (*)']);
                        }
                        catch (e) {
                            reject(e);
                        }
                        connection.release();
                        pool.end()
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
