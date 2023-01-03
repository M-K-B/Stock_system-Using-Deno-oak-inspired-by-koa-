import { Router } from "https://deno.land/x/oak/mod.ts"
import { Handlebars } from 'https://deno.land/x/handlebars/mod.ts';
import { db } from "./db.js"
import { login, register } from "./modules/accounts.js";
import { newStock, generateBarcode } from "./modules/newstock.js"
import { getProducts, singleProducts } from "./modules/StockData.js"
import { parse } from "https://deno.land/std@0.170.0/flags/mod.ts";
import { changeAisle, changeName, changePrice , changeLocation, changeQuanity, changePhoto, updateUser, insertDate, updateSavePhoto, deleteStock} from "./modules/changeProduct.js";
const router = new Router();

const handle = new Handlebars({
    baseDir: 'views',
    extname: '.hbs',
    layoutsDir: 'layouts/',
    partialsDir: 'partials/',
    cachePartials: true,
    defaultLayout: 'main',
    helpers: undefined,
    compilerOptions: undefined,
});

//Home page
router.get('/', async(ctx) => {
    console.log('GET home')
    const auth = await ctx.cookies.get('authorised')

    


    if(auth){
        const authorised = { auth }
        const userValue = authorised.toString(authorised[0])
        
        let productInfo = await getProducts()
        ctx.response.body = await handle.renderView('home', {data : productInfo})
    }else{
        console.log('user not logged in')
        ctx.response.redirect('/login')
    }

})

//Login page

router.get('/login', async(ctx) => {
    console.log('GET /login')
    ctx.response.body = await  handle.renderView('login')
})

router.post('/login', async(ctx) => {
    console.log('GET /login')
    const body = ctx.request.body({type : 'form'})
    const value = await body.value
    const obj = Object.fromEntries(value)
    console.log(obj)
    try {
        const username = await login(obj)
        await ctx.cookies.set('authorised', username)
        ctx.response.redirect('/')
    }catch(err){
        console.log(err)
        ctx.response.redirect('/login')
    }
})


//Register page
router.get('/register', async(ctx) =>{
    console.log('GET /register')
    ctx.response.body = await  handle.renderView('register')
})

router.post('/register', async(ctx) =>{
    console.log('POST /register')
    const body = ctx.request.body({type : 'form'})
    const value = await body.value
    console.log(`value : ${value}`)
    const obj = Object.fromEntries(value)
    console.log(obj.password)
    if(obj.password === obj.password2){
        console.log('passwords match')
        console.log(obj)
        let option = await register(obj)
        if (option == true){
            ctx.response.redirect('/login')
        }else{
        ctx.response.body = await handle.renderView('register', {message : "User alredy exists"})
        }
    }else{
        ctx.response.body = await handle.renderView('register', {message : "Password doesnt match"})
    }
    
});

router.get('/logout', async ctx => {
    await ctx.cookies.delete('authorised')
    ctx.response.redirect('/login')
})


/// stock form
router.get('/addStock', async (ctx) =>{
    console.log('GET /stock')
    const auth = await ctx.cookies.get('authorised')
    

    
    if(auth){
        const newBarcode = await generateBarcode();
        
        ctx.response.body = await  handle.renderView('addStock', {data : `${newBarcode}`})
    }else{
        ctx.response.redirect('/login')
    }
})


router.post('/addStock', async (ctx) => {
    console.log('POST /stock')
    const body = ctx.request.body({type : 'form-data'})
    const auth = await ctx.cookies.get('authorised')
    console.log(`username ${auth}`)
    const data = await body.value.read()
    data.username = auth
    await newStock(data, auth)
    ctx.response.redirect('/')
})

router.get('/update/:barcode', async(ctx)=>{


    
    const barcode = ctx.params.barcode;

    let data = await singleProducts(barcode)
    ctx.response.body = await handle.renderView('update', {data : data})
    
    
})


router.get('/update/changeName/:barcode', async(ctx)=>{
    
    const barcode = ctx.params.barcode;

    let data = await singleProducts(barcode)

    ctx.response.body = await handle.renderView('Name' , {data : data})
});

router.post('/update/changeName/:barcode', async(ctx)=>{
    
    
    const barcode = ctx.params.barcode;

    console.log(`barcode is ${barcode}`)
    let data = await singleProducts(barcode)
    console.log(`data is ${data[0]}`)


    const name = await ctx.request.body().value.read();

    let newData = name['fields']['name']
    console.log(`new data is ${newData}`)


    await changeName(newData, data[0])
    ctx.response.redirect('/')
    
});




router.get('/update/changePrice/:barcode', async(ctx)=>{

    const barcode = ctx.params.barcode;

    let data = await singleProducts(barcode)

    ctx.response.body = await handle.renderView('price' , {data : data})
    
})

router.post('/update/changePrice/:barcode', async(ctx)=>{
    
    
    const barcode = ctx.params.barcode;

    console.log(`barcode is ${barcode}`)
    let data = await singleProducts(barcode)
    console.log(`data is ${data[0]}`)


    const price = await ctx.request.body().value.read();
    console.log(price)
    let newPrice = price['fields']['price']
    console.log(`new price is ${newPrice}`)


    await changePrice(newPrice, data[0])
    ctx.response.redirect('/')
    
});






router.get('/update/changeAisle/:barcode', async(ctx)=>{

    const barcode = ctx.params.barcode;

    let data = await singleProducts(barcode)

    ctx.response.body = await handle.renderView('Aisle' , {data : data})
    
})

router.post('/update/changeAisle/:barcode', async(ctx)=>{
    
    
    const barcode = ctx.params.barcode;

    console.log(`barcode is ${barcode}`)
    let data = await singleProducts(barcode)
    console.log(`data is ${data[0]}`)


    const aisle = await ctx.request.body().value.read();
    console.log(aisle)
    let newAisle = aisle['fields']['aisle']
    console.log(`new aisle is ${newAisle}`)


    await changeAisle(newAisle, data[0])
    ctx.response.redirect('/')
    
});






router.get('/update/changeLocation/:barcode', async(ctx)=>{

    const barcode = ctx.params.barcode;

    let data = await singleProducts(barcode)

    ctx.response.body = await handle.renderView('location' , {data : data})
    
});




router.post('/update/changeLocation/:barcode', async(ctx)=>{
    
    
    const barcode = ctx.params.barcode;

    console.log(`barcode is ${barcode}`)
    let data = await singleProducts(barcode)
    console.log(`data is ${data[0]}`)


    const location = await ctx.request.body().value.read();
    console.log(location)
    let newLoc = location['fields']['location']
    console.log(`new aisle is ${newLoc}`)


    await changeLocation(newLoc, data[0])
    ctx.response.redirect('/')
    
});

















router.get('/update/changeQuanity/:barcode', async(ctx)=>{

    const barcode = ctx.params.barcode;

    let data = await singleProducts(barcode)

    ctx.response.body = await handle.renderView('quanity' , {data : data})
    
});

router.post('/update/changeQuanity/:barcode', async(ctx)=>{
    
    
    const barcode = ctx.params.barcode;

    console.log(`barcode is ${barcode}`)
    let data = await singleProducts(barcode)
    console.log(`data is ${data[0]}`)


    const quanity = await ctx.request.body().value.read();
    console.log(quanity)
    let newQuanity = quanity['fields']['quanity']
    console.log(`new aisle is ${newQuanity}`)


    await changeQuanity(newQuanity, data[0])
    ctx.response.redirect('/')
    
});









router.get('/update/changePhoto/:barcode', async(ctx)=>{

    const barcode = ctx.params.barcode;

    let data = await singleProducts(barcode)

    ctx.response.body = await handle.renderView('photo' , {data : data})
    
});



router.post('/update/changePhoto/:barcode', async(ctx)=>{
    
    
    const barcode = ctx.params.barcode;

    console.log(`barcode is ${barcode}`)
    let data = await singleProducts(barcode)
    console.log(`data is ${data[0]}`)


    const image = await ctx.request.body().value.read();
    console.log(image)
    let newImage = image.files[0]
    console.log(`new aisle is ${newImage}`)
    const auth = await ctx.cookies.get('authorised')
    let userData = auth
    let imageData = await updateSavePhoto(newImage, userData)

    await changePhoto(imageData, data[0])


    
    

    await updateUser(userData, data[0])
    await insertDate(data[0])

    ctx.response.redirect('/')
    
});


router.get('/delete/:barcode', async ctx => {

    const barcode = ctx.params.barcode;
    console.log(barcode)

    let data = await singleProducts(barcode)
    console.log(data)

    await deleteStock(data[0])
    ctx.response.redirect('/')
})

export default router