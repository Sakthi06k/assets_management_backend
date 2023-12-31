const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TaskSchema = new Schema(
    {
        firstName:String,
        lastName:String,
        email:{
            type:String,
            unique:true,
            lowercase:true
            
        },
        password:String,
        asserts:{
            type:Array
        }

    },
    {timestamps:true}
);

module.exports = mongoose.model("user",TaskSchema)