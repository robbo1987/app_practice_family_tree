const express = require('express')
const database = require ('./database./database')
const app = express();

app.get('/', (req,res) => res.redirect('/family'))

app.get('/family', async (req,res,next) => {
    try {
        const sql = `SELECT * FROM family_members`;
        const response = await database.query(sql);
        const family = response.rows;
        const html = family.map( person => {
        return `
        
        <div>
            <a href = '/family/${person.id}'> ${ person.name } </a>
        </div>
        `;
        }).join('');
        res.send(`
        <h1> Robby's Family Page</h1>
        ${html}`)
    }

    catch (ex){
        next(ex)
    }
    })

    app.get('/family/:id', async (req,res,next) => {
        try {
            const sql = `SELECT * FROM family_about JOIN family_members ON family_about.family_id=family_members.id WHERE family_id=$1`;
            const response = await database.query(sql, [req.params.id]);
            const family = response.rows[0];
           
            res.send(`
            <html>
                <body>
                    <title> Family About Page </title>
                    <H1>Robby's Family Page </h1>
                    <div>
                        
                            <ul> ${family.name}'s favorite hobby: ${family.hobby1}</ul>
                            <ul> ${family.name}'s favorite team: ${family.favorite_team}</ul>
                       
                    </div>
                </body>
            </html>
            
            
            `)
        }
    
        catch (ex){
            next(ex)
        }
        })

 

  

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

