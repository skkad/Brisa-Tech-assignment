const mongoose = require('mongoose');
const Schema = mongoose.Schema 

// category schema

const categorySchema = new Schema({
    categoryName : String
});

// product schema
const productSchema = new Schema({
    // productId : Number,
    productName : String,
    // categoryName : String,
    category : {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
    
})

// creating models

const Category = mongoose.model('Category',categorySchema);
const Product = mongoose.model('Product',productSchema);

// exporting models
module.exports = { Category , Product}