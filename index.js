import { Application } from "https://deno.land/x/oak/mod.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { db } from "./db.js"
import { Handlebars } from 'https://deno.land/x/handlebars/mod.ts';

import router from './routes.js'
const PORT = 8000;
const app = new Application();
const env = config({path : '.env'});

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


app.use(async (ctx, next)=>{
    try{
        console.log(ctx.request.url.href)
        const auth = await ctx.cookies.get('authorised')
        console.log(`authorised cookie: ${auth}`)
    await next()
    }catch(err){
        console.log(err)
    }
})

app.use(router.routes());
app.use(router.allowedMethods());

// static content 
app.use(async (ctx, next)=>{
    const root = `${Deno.cwd()}/public`
    try{
        await ctx.send({root})
    }catch{
        next()
    }
})

// page not found
/* app.use(async ctx =>{
    try {
        console.log('404 PAGE NOT FOUND')
        const body = await handle.renderView('404')
        ctx.response.body = body
    }catch(err){
        console.log(err)
    }
})
*/


app.addEventListener('listen', ()=>{
    console.log(`listening on port ${PORT}`)
});


await app.listen({port : PORT})