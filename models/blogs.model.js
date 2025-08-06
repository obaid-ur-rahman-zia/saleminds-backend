const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
   title: {
    type: String,
    required: true
   },
   subTitle:{
    type: String,
   },
   description:{
    type: String,
    required: true
   },
   bannerImage:{
    type: String
   },
   blogImages:{
    type: [String]
   },
   createdOn:{
    type: Date,
    default: Date.now
   },
   createdBy:{
    type: String
   },
   status:{
    type: Boolean,
    default: false
   }
});



module.exports = mongoose.model("blogs", blogSchema);
