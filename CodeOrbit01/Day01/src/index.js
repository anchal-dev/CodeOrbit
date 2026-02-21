const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieparser = require('cookie-parser');



app.use(express.json());//to convert json  into js object
app.use(cookieparser()); // cookie comes in the form of string, this will convert it into js object

main()
    .then(async () =>{
        app.listen(process.env.PORT, () => {
    console.log("Server is running on port: " + process.env.PORT);
    })
})

.catch(err=> console.log("Error in connecting to database: " + err));