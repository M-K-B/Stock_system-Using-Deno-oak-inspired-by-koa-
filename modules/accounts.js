import {compare, genSalt, hash} from "https://deno.land/x/bcrypt/mod.ts";

import {db} from '../db.js'


const saltRounds = 10
const salt = await genSalt(saltRounds)



export async function login(data){
    console.log(data)

    let loginName = data.username.toLowerCase();
    let sql = `SELECT count(id) AS count FROM accounts where user = ?;`
    let records = await db.query(sql, [loginName]);
    if(!records[0].count) throw new Error(`username "${data.username}" not found`)
    sql = `SELECT pass FROM accounts WHERE user = ?;`
    records = await db.query(sql, [loginName])
    const valid = await compare(data.password, records[0].pass)
    if(valid === false) throw new Error(`invalid password for account "${data.username}"`)
    return data.username
}


export async function register(data){

    let insertName = data.username.toLowerCase();
    let checkUser = `SELECT count(id) AS count FROM accounts where user= ?;`

    let records = await db.query(checkUser, [insertName]);


    console.log(`${records[0].count} : records`)
    if (records[0].count > 0){
        return false
    }else{
        const password = await hash(data.password, salt)
        const sql = `INSERT INTO accounts(user, pass) VALUES("${insertName}", "${password}")`
        console.log(sql)
        await db.query(sql)
        return true
    }
}