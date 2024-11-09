const express = require("express");
const connection = require("./connection");
const app = express();
const rootRouter  = require("./routes/index")
const cors = require("cors")
connection();
app.use(cors());
app.use(express.json())
app.use("/api/v1", rootRouter)




app.listen(3000, (req ,res) => {
    try{
        console.log("Server is running at 3000")
    }catch(err){
        console.log("error", err)
    }
})

