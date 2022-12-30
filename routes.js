import { Router } from "https://deno.land/x/oak/mod.ts"
import { Handlebars } from 'https://deno.land/x/handlebars/mod.ts';
import { db } from "./db.js"
import { login, register } from "./modules/accounts.js";
import { newStock } from "./modules/newstock.js"
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

        console.log(`This is the user logged in ${userValue}`)

        let stockQ = `SELECT * FROM product;`
        let stockinfo = await db.query(stockQ)


        console.log(stockinfo)

        

        let stockNum = stockinfo
       // console.log(stockNum)

        

        //let user  = JSON.stringify(getUserInfo[0]['user'])
       // console.log(user)
       let creators = []
       for(let i = 0; i < stockNum.length; i++){

            let idSql = `select user from accounts where id = ${stockinfo[i]['updatedBy']}`
            let getUserInfo = await db.query(idSql)
            console.log(`user is ${getUserInfo}`)
            
            let a = JSON.stringify(getUserInfo)
            
            creators.push(a)
       }
       
     console.log(`creators is ${creators}`)
        let UpD = []
        for(let i = 0; i < creators.length; i++){
            let a = creators[i]
            UpD.push(a)
       }
       

       console.log(UpD)

       let array = UpD
       
        for(let i = 0; i < array.length; i++){
        const obj = JSON.parse(array[i])[0];
        console.log(`obj ${i} is ${obj}`)
        
        if (stockNum[i].id){
            stockNum[i].Created = obj['user']
        }
        }
       

       console.log(stockNum)
        console.log(`stock  is ${creators.length}`)
        ctx.response.body = await handle.renderView('home', {data : stockNum})

        

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
    const obj = Object.fromEntries(value)
    console.log(obj)
    await register(obj)
    ctx.response.redirect('/login')
})

router.get('/logout', async ctx => {
    await ctx.cookies.delete('authorised')
    ctx.response.redirect('/login')
})


/// stock form
router.get('/addStock', async (ctx) =>{
    console.log('GET /stock')
    const auth = await ctx.cookies.get('authorised')
    if(auth){
        ctx.response.body = await  handle.renderView('addStock')
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

export default router