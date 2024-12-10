require('dotenv').config()
const mongoose = require('mongoose')
const DB_URL = process.env.DB_URL


async function connect() {
    try{
        await mongoose.connect(DB_URL)
        console.log('Connect successfully');
    }catch(error){
        console.log('Error', error);
        
    }
}

module.exports = {connect}
