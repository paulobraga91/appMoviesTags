const sqlite3 = require("sqlite3")//drive para conexao
const sqlite = require("sqlite")//conexão
const path = require("path")

async function sqliteConnection(){
    const database = await sqlite.open({
        filename: path.resolve(__dirname,"..","database.db"),
        driver: sqlite3.Database

    });

    return database
}

module.exports = sqliteConnection;