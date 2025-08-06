const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MetaTagsSchema = new Schema({
  pages: {
    type: String,
  },
  type:{
    type: String
  },
  metaName:{
    type: String
  },
  content:{
    type: String
  },
  createdOn:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MetaTags', MetaTagsSchema);