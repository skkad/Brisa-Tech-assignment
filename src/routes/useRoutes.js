const express = require('express');
const axios = require('axios');
const { Category ,Product} = require('../db/model/userModel');
const router = express.Router();



/* ***************** view route ***************/

router.get('/viewCategories',async (req,res)=>{
    // res.send("View categories")
    
    const data = await axios.get('http://localhost:4000/api/get-categories')
    console.log(data.data);
    const category_array = data.data;
    res.render('categoryFile/viewCategory.ejs',{category_array: category_array});
})

router.get('/addCategories',(req,res)=>{
    // res.send("Add categories")
    res.render('categoryFile/addCategory.ejs');
})

router.get('/editCategories/:cat_id',async (req,res)=>{
    // res.send("Add categories")
    const cat_id = req.params.cat_id;
    const data = await axios.get('http://localhost:4000/api/get-single-category/'+cat_id)
    console.log(data.data);
    const category_data = data.data;
    res.render('categoryFile/editCategory.ejs',{category_data: category_data});
})



router.get('/viewProducts',async (req,res)=>{
    // res.send("View Products")
    var pg_num = req.query.page;
    if(pg_num===undefined){
        pg_num = "0"
    }else{
        pg_num = (pg_num-1)*10 //count=10
        
    }
    const data = await axios.get('http://localhost:4000/api/get-product?start='+pg_num)
    console.log(data.data);
    const products_array = data.data;
    res.render('productFile/viewProduct.ejs',{products_array: products_array})
})

router.get('/addProducts',async (req,res)=>{
    // res.send("Add Products")
    const data = await axios.get('http://localhost:4000/api/get-categories')
    console.log(data.data);
    const category_array = data.data;
    res.render('productFile/addProduct.ejs',{category_array:category_array})
})

router.get('/editProducts/:prod_id',async (req,res)=>{
    // res.send("Add categories")
    const prod_id = req.params.prod_id;
    const data = await axios.get('http://localhost:4000/api/get-single-product/'+prod_id)
    console.log(data.data);
    const product_data = data.data;
    res.render('productFile/editProduct.ejs',{product_data:product_data});
})

/* ***************** view route ***************/

/* ***************** Api route ***************/

/*************** Category api **********************/
router.get('/api/get-categories',async (req,res)=>{
    var start = req.query.start;
    var count = req.query.count;

    if(start=== undefined){
        start=0;
    }
    if(count===undefined){
        count=10;
    }

    var resObj = {}

    start = parseInt(start);
    count = parseInt(count);

    const catData = await Category.find(resObj,"",{skip: start, limit:count})
    res.send(catData);
})

router.post('/api/post-categories',(req,res)=>{
    const catName = req.body.catName;
    console.log(catName);
    const new_cat = new Category({
        categoryName : catName
    })
    new_cat.save()
    .then((item)=>{
        try{
            res.redirect('http://localhost:4000/viewCategories')
            
        }catch(err){
            res.status(400).send(err)
        }

        
    })
})


router.get('/api/get-single-category/:categoryId',async (req,res)=>{
    var category_id = req.params.categoryId;
    var catData = await Category.findOne({_id:category_id})
    res.send(catData);
})

router.post('/api/update-single-category/:categoryId',async (req,res)=>{
    var category_id = req.params.categoryId;
    var category_name = req.body.catName;
    var catData = await Category.updateOne({_id:category_id},{categoryName:category_name})
    // res.send(catData);
    res.redirect('http://localhost:4000/viewCategories')
})

router.get('/api/delete-single-category/:categoryId',async (req,res)=>{
    var category_id = req.params.categoryId;
    var catData = await Category.deleteOne({_id:category_id})
    console.log(catData);
    res.redirect('http://localhost:4000/viewCategories');
})

/*************** Products api **********************/
router.get('/api/get-product', (req,res)=>{
    var start = req.query.start;
    var count = req.query.count;
    var category_id = req.query.category_id;

    if(start=== undefined){
        start=0;
    }
    if(count===undefined){
        count=10;
    }
    

    var findObj = {}

    if(category_id){
        findObj["category"] = category_id
    }

    start = parseInt(start);
    count = parseInt(count);

    const prodData =  Product.find(findObj,"",{skip: start, limit:count}).populate('category').exec((err,data)=>{
        if(err){
            res.status(400).send(err);
        }else{
            res.send(data);
        }
    })
    // res.send(prodData);
})

router.post('/api/post-product',(req,res)=>{
    const productname = req.body.productname;
    const category_id = req.body.category_id;

    const new_prod = new Product({
        productName: productname,
        category: category_id
    })
    new_prod.save()
    .then((item)=>{
        // console.log(item)
        try{
            res.redirect('http://localhost:4000/viewProducts')
            // res.send(item)
            
        }catch(err){
            res.status(400).send(err)
        }
        
    })
})



router.get('/api/get-single-product/:productId',async (req,res)=>{
    var product_id = req.params.productId;
    var prodData = await Product.findOne({_id:product_id})
    res.send(prodData);
})

router.post('/api/update-single-product/:productId',async (req,res)=>{
    var product_id = req.params.productId;
    var product_name = req.body.productname;
    console.log("prodId"+product_id);
    console.log("prodName"+product_name);
    var prodData = await Product.updateOne({_id:product_id},{productName:product_name})
    // res.send(prodData);
    res.redirect('http://localhost:4000/viewProducts')
})



router.get('/api/delete-single-product/:productId',async (req,res)=>{
    var product_id = req.params.productId;
    var prodData = await Product.deleteOne({_id:product_id})
    // res.send(prodData);
    res.redirect('http://localhost:4000/viewProducts')
})

module.exports = router;