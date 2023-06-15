const mongoose=require('mongoose')
const database=mongoose.connect('mongodb://127.0.0.1:27017/blogdatabase',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then((db)=>{
    console.log(`the data base connected to ${db.connection.host}`)
}).catch((error)=>{
    console.log(`the error is ${error}`)
})
module.exports=database