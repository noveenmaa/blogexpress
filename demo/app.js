require('dotenv').config()
require('./server/config/db')
const express=require('express')
const app=express()
const port=8000||process.env.port
const expresslayout=require('express-ejs-layouts')
const cookieparser=require('cookie-parser')
const mongostore =require('connect-mongo')
const session=require('express-session')
const methodoverride=require('method-override')


//session creation and mongo-connect --------------------------------------------------------------
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: mongostore.create({
      mongoUrl:"mongodb://127.0.0.1:27017/blogdatabase",
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
  }));
//using some of middleware--------------------------------------------------------------------------------
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieparser());
app.use(express.static('public'))
app.use(methodoverride('_method'))
//setting up view engine------------------------------------------------------------------------------

app.use(expresslayout)
app.set('layout',"./layouts/main")
app.set('view engine','ejs')

//routing to app--------------------------------------------------------------------------------------------------

app.use('/',require('./server/routers/main'))
app.use('/',require('./server/routers/admin'))


//listening to port-----------------------------------------------------------------------------------------

app.listen(port,()=>{
    console.log(`the port is running at ${port}`)
})