
const mysql = require('mysql');

const config = require('./src/config');

main();

async function main() {
    console.time('Retrieving list of tables: ');
    let tableList;
    try {
        tableList = await listTables();
    } catch (error) {
        console.error(`Error at retrieving list of tables: ${JSON.stringify(error, null, 4)}`);
    }
    console.timeEnd('Retrieving list of tables: ');
    console.log(`Table list: ${tableList.join(', ')}`);

    if (tableList.indexOf(config.custom.dbTables.scores.tableName) < 0) {
        console.time('Setting up score table: ');
        try {
            const tableSetupResult = await createScoreTable();
            console.log(`Table setup result: ${JSON.stringify(tableSetupResult, null, 4)}`);
        } catch (error) {
            console.error(`Error at setting up score table: ${JSON.stringify(error, null, 4)}`);
        }
        console.timeEnd('Setting up score table: ');
    } else {
        console.log(`Score table (${
            config.custom.dbTables.scores.tableName
        }) already set up. :)`);
    }

    return;
}

function listTables() {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await mysql.createConnection();
            const query = connection.query(
                `SHOW TABLES;`,
                [],
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(
                        results.map(
                            (table) => {
                                return table[Object.keys(table)[0]]
                            }
                        )
                    );
                    connection.end();
                }
            );
        } catch (e) {
            reject(e);
        }
    });
}

function createScoreTable() {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await mysql.createConnection();
            const query = connection.query(
                `CREATE TABLE ${
                    config.custom.dbTables.scores.tableName
                } (${
                    config.custom.dbTables.scores.primaryKeyColumn
                } INT NOT NULL AUTO_INCREMENT, ${
                    config.custom.dbTables.scores.scoreColumnName
                } INT, PRIMARY KEY (${
                    config.custom.dbTables.scores.primaryKeyColumn
                }));`,
                [],
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(results);
                    connection.end();
                }
            );
        } catch (e) {
            reject(e);
        }
    });
}
