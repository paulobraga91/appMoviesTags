const sqliteConnection = require("../../sqlite");

const createUsers = require("./createUsers");

async function migrationsRun(){
    const schemas = [
        createUsers
    ].join('');//pegar todas as migrations e usar como parametro para juntar

    sqliteConnection().then(db => db.exec(schemas)).catch(error => console.error(error));
}

module.exports = migrationsRun