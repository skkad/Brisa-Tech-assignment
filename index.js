const express = require('express')
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/useRoutes');
const app = express();



// importing connectDB to connect with database
require('./src/db/connectDB')

//
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/',userRoutes);


app.set("view engine", "ejs");
app.set("views",'./src/views');

app.get('/',(req,res)=>{
    
    res.render("Header/header.ejs");
    
})



const PORT = 4000;
app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`);
})