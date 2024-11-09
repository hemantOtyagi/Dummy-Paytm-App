const mongoose  = require("mongoose");
async function Connection(){
    try{
        await mongoose.connect("mongodb://localhost:27017/paytmDB")
        console.log(" DB connection successfull"); 
    }catch(error){
        console.log("error in connection with db", error);
    }
}

module.exports = Connection