import { db } from "../db.js";


export async function changeName(newData, data){
    console.log()
    console.log(data.barcode)
    let sqlName = `UPDATE product
                SET name = '${newData}'
                WHERE barcode = ${data.barcode};`
    
    let result = await db.query(sqlName)
    console.log(result)
    console.log(result)
    return result.lastInsertId
}


export async function changePrice(newPrice, data){
    console.log(newPrice)
    console.log(data.barcode)
    let sqlPrice = `UPDATE product
                SET price = '${newPrice}'
                WHERE barcode = ${data.barcode};`
    
    let result = await db.query(sqlPrice)
    console.log(result)
    console.log(result)
    return result.lastInsertId
}


export async function changeAisle(newAisle, data){
    console.log()
    console.log(data.barcode)
    let sql = `UPDATE product
                SET aisle = '${newAisle}'
                WHERE barcode = ${data.barcode};`
    
    let result = await db.query(sql)
    console.log(result)
    console.log(result)
    return result.lastInsertId
}


export async function changeLocation(newLoc, data){
    console.log()
    console.log(data.barcode)
    let sql = `UPDATE product
                SET location = '${newLoc}'
                WHERE barcode = ${data.barcode};`
    
    let result = await db.query(sql)
    console.log(result)
    console.log(result)
    return result.lastInsertId
}




export async function changeQuanity(newQuanity, data){
    
    console.log(data.barcode)




                        let checkAmount = `SELECT quanity FROM product WHERE barcode = ?`
                        let AmountChecker = await db.query(checkAmount, [data.barcode])
                        let queryAmount = JSON.stringify(AmountChecker[0]["quanity"])

                        console.log(`amount is ${queryAmount}`)
                        console.log(`new amount to be add ${newQuanity}`)
                        let a = queryAmount * 1
                        let b = newQuanity * 1

                        let newValue = a + b
                        console.log(newValue)


                        let NewSql = `UPDATE product SET quanity = ${newValue} WHERE barcode = ${data.barcode}`
                        let result = await db.query(NewSql)

                        console.log(result)
                        return result.lastInsertId
}

export async function changePhoto(imageData, data){
    console.log()
    console.log(data.barcode)
    let sql = `UPDATE product
                SET photo = '${imageData}'
                WHERE barcode = ${data.barcode};`
    
    let result = await db.query(sql)
    console.log(result)
    console.log(result)
    return result.lastInsertId
}


export async function updateUser(userData, data){
    console.log(`user data is ${userData}`)
    let Getuser = `SELECT id FROM accounts WHERE user = "${userData}"`
    let result = await db.query(Getuser)
    console.log(result)
    const userid = result[0].id
    

    let sql = `UPDATE product
                SET updatedBy = '${userid}'
                WHERE barcode = ${data.barcode};`
    
    result = await db.query(sql)
    console.log(result)
    console.log(result)
    return result.lastInsertId

}

export async function insertDate(data){
    const now = new Date().toISOString()
    console.log (`ISO Date string: ${now}`)
    const date = now.slice(0,19).replace('T', ' ')


    let sql = `UPDATE product
                SET added = '${date}'
                WHERE barcode = ${data.barcode};`


                let result = await db.query(sql)
                console.log(result)
                console.log(result)
                return result.lastInsertId
}

export async function updateSavePhoto(file, userData) {
    let filename = ''
    if (file.contentType !== 'application/octet-stream'){
        const ext = file.filename.split('.').pop()
        filename = `${userData}-${Date.now()}.${ext}`
        await Deno.rename(file.filename, `${Deno.cwd()}/public/uploads/${filename}`)
    }
    console.log(filename)
    return filename
}

export async function deleteStock(data){

    let Sqlfile = `SELECT photo FROM product where barcode = ${data.barcode};`
    let file_record = await db.query(Sqlfile)
    console.log(file_record[0].photo)
    const filePath = `${file_record[0].photo}`;
    

    let sql = `DELETE FROM product WHERE barcode = ${data.barcode};`

    let result = await db.query(sql)
    await Deno.remove(`${Deno.cwd()}/public/uploads/${filePath}`)
    console.log(result)
    console.log(result)
    return result.affectedRows
}