const pg = require('pg')
const Client = pg.Client;

const myClient = new Client(process.env.DATABASE_URL || 'postgres://localhost/robby_family_db')

module.exports = myClient;