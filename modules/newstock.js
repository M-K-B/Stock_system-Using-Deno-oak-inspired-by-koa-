import { db } from "../db.js"

export async function newStock(data, auth){
    console.log('newStock()')
    data.username = auth
    data.fields.username = data.username
    data.files[0].username = data.username
    data.fields.thumbnail = await savePhoto(data.files[0])
    data.fields.insertID = await addNewStock(data.fields)
    
}

export async function savePhoto(file) {
    let filename = ''
    if (file.contentType !== 'application/octet-stream'){
        const ext = file.filename.split('.').pop()
        filename = `${file.username}-${Date.now()}.${ext}`
        await Deno.rename(file.filename, `${Deno.cwd()}/public/uploads/${filename}`)
    }
    console.log(filename)
    return filename
}



export async function generateBarcode() {
    let newBarcode = Math.floor(Math.random() * 10000000000);
    console.log(`new Barcode ${newBarcode}`);
    try {
      const result = await db.query("SELECT COUNT(*) as count FROM product WHERE barcode = ?", [newBarcode]);
      if (result[0].count === 0) {
        return newBarcode;
      } else {
        return generateBarcode();
      }
    } catch (error) {
      // handle error
      console.log(error)
    }
    // return default value or throw error
  }

async function addNewStock(data){
    console.log('addNewStock')
    let sql = `SELECT id FROM accounts WHERE user = "${data.username}"`
    let result = await db.query(sql)
    const userid = result[0].id
    const now = new Date().toISOString()
    console.log (`ISO Date string: ${now}`)
    const date = now.slice(0,19).replace('T', ' ')
    console.log(date)
    console.log(data)

    let emptyTableCheck = `SELECT EXISTS (SELECT 1 FROM product);`
    let TableChecker = await db.query(emptyTableCheck)
    let strTableCheck = JSON.stringify(TableChecker[0]["EXISTS (SELECT 1 FROM product)"])
    let checkVal = strTableCheck * 1
    
    console.log(`Table value is 1 true or 0 false ${checkVal}`)



            if(checkVal === 1){

                // CHECK ROW EXISTS

                let checkRowE = `SELECT EXISTS (SELECT barcode FROM product WHERE barcode = ${data.barcode});`
                let queryRowCheck = await db.query(checkRowE)
                let RowJSON = JSON.stringify(queryRowCheck[0][`EXISTS (SELECT barcode FROM product WHERE barcode = ${data.barcode})`]) 
                let RowVal = RowJSON * 1
                console.log(`Row Value is : ${RowVal}`)

                if(RowVal === 1){
                    let checkRecords = `SELECT barcode FROM product WHERE barcode = ${data.barcode}`
                    let SqlChecker = await db.query(checkRecords)
            
                    let queryCheck = JSON.stringify(SqlChecker[0]['barcode'])

            //let StringCheck = SqlChecker["barcode"].toString()
        // let barcodeObj = { StringCheck }
                    console.log(SqlChecker[0]['barcode'])
                    console.log(queryCheck)
        // console.log(`barcode is ${StringCheck.barcode}`)
        // console.log(barcodeObj[0])
                    console.log(data.barcode)

                    if(queryCheck === data.barcode){
                            let checkAmount = `SELECT quanity FROM product WHERE barcode = ?`
                            let AmountChecker = await db.query(checkAmount, [data.barcode])
                            let queryAmount = JSON.stringify(AmountChecker[0]["quanity"])


                            console.log(`amount is ${queryAmount}`)
                            console.log(`new amount to be add ${data.quanity}`)
                            let a = queryAmount * 1
                            let b = data.quanity * 1

                            let newValue = a + b
                            console.log(newValue)
                            let NewSql = `UPDATE product SET quanity = ${newValue} WHERE barcode = ${data.barcode}`
                            result = await db.query(NewSql)
                            console.log(result)
                            return result.lastInsertId
                    }else{
                        sql = `INSERT INTO product(updatedBy, barcode, name, photo, Aisle , Location, price, quanity, added)\
                        VALUES(${userid}, "${data.barcode}","${data.name}","${data.thumbnail}","${data.aisle}","${data.location}", "${data.price}", "${data.quanity}", "${date}")`
                            sql = sql.replaceAll('""', 'NULL')
                            result = await db.query(sql)
                            console.log(result)
                            return result.lastInsertId
                        }
        
                }else{
                    sql = `INSERT INTO product(updatedBy, barcode, name, photo, Aisle , Location, price, quanity, added)\
                    VALUES(${userid}, "${data.barcode}","${data.name}","${data.thumbnail}","${data.aisle}","${data.location}", "${data.price}", "${data.quanity}", "${date}")`
            sql = sql.replaceAll('""', 'NULL')
            result = await db.query(sql)
            console.log(result)
            return result.lastInsertId
        }
        
    
        }else{
            sql = `INSERT INTO product(updatedBy, barcode, name, photo, Aisle , Location, price, quanity, added)\
                        VALUES(${userid}, "${data.barcode}","${data.name}","${data.thumbnail}","${data.aisle}","${data.location}", "${data.price}", "${data.quanity}", "${date}")`
            sql = sql.replaceAll('""', 'NULL')
            result = await db.query(sql)
            console.log(result)
            return result.lastInsertId
        }


        console.log(sql)

    
}