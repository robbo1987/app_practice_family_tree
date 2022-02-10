const express = require('express');
const database = require ('./database./database')
const app = express();


app.get('/', (req,res) => res.redirect('/family'));

app.use('/family', require('./product-route'))
  

const startUp = async() => {

    try {
    await database.connect();
    const sql =`
    DROP TABLE IF EXISTS family_about;
    DROP TABLE IF EXISTS family_members;
    
    CREATE TABLE family_members(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20) UNIQUE
    );
    CREATE TABLE family_about(
        id SERIAL PRIMARY KEY,
        hobby1 VARCHAR(50),
        favorite_team VARCHAR(50),
        family_id INTEGER REFERENCES family_members(id)

        );

    INSERT INTO family_members(name) VALUES('amy');
    INSERT INTO family_members(name) VALUES('elaine');
    INSERT INTO family_members(name) VALUES('weezy');
    INSERT INTO family_about(hobby1,favorite_team,family_id) VALUES('knitting','mets', (SELECT id from family_members WHERE NAME ='amy'));
    INSERT INTO family_about(hobby1,favorite_team,family_id) VALUES('travel','yankees',(SELECT id from family_members WHERE NAME ='elaine'));
    INSERT INTO family_about(hobby1,favorite_team,family_id) VALUES('tennis','dodgers',(SELECT id from family_members WHERE NAME ='weezy'));
  

    `;
    await database.query(sql)
    console.log('hello world, data is seeded')
    const port = process.env.PORT || 3000;
    app.listen (port, () => {
        console.log(`listening on port ${port}`)
    })
    }
    catch(ex) {
        console.log(ex)
    }
}

startUp()

