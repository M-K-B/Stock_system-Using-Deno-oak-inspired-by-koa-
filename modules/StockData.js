import { db } from "../db.js"

export async function getProducts(){

// stock query for the database
let stockQ = `SELECT * FROM product;` 
let stockinfo = await db.query(stockQ)



// save data to new variable
let stockNum = stockinfo

let creators = []

/// find the creator of the stock or last person to update it. loop becuase more than one stock is the stock number in the array to find user 
for(let i = 0; i < stockNum.length; i++){

    let idSql = `select user from accounts where id = ${stockinfo[i]['updatedBy']}`
    let getUserInfo = await db.query(idSql)
    
    // json so we dont get the error [object object]
    
    let a = JSON.stringify(getUserInfo)
    // save it to our empty array 
    creators.push(a)
}

let UpD = []
// do it again because we need to parse it this too so we dont end up with '[{"user":"user"}]' with the quotes 
for(let i = 0; i < creators.length; i++){
    let a = creators[i]
    UpD.push(a)
}


console.log(UpD)

let array = UpD

for(let i = 0; i < array.length; i++){
const obj = JSON.parse(array[i])[0];

// save it to of stock obj so we can access it when we return it to handlebars file
if (stockNum[i].id){
    stockNum[i].Created = obj['user']
}
}

console.log(`stock  is ${creators.length}`)

    return stockNum
}



export async function singleProducts(barcode){

    

    console.log(barcode)
    
    let sql = 'SELECT * FROM product where barcode = ?'
    let data = await db.query(sql, [barcode])
    console.log(data)
    return data
    }


