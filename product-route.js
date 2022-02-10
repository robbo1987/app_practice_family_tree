
const express = require('express');
const route = express.Router();
const database = require ('./database./database')



route.get('/', async (req,res,next) => {
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

    route.get('/:id', async (req,res,next) => {
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

        module.exports = route;
 