import { validationResult } from "express-validator";
import HttpError from "../helpers/httpError.js";
import Product from "../model/product.js";

// Get all products
export const getProducts = async (req, res, next) => {
  try {
    const { limit = 3, skip = 0, category = "All", q = "" } = req.query;
    const limitNum = parseInt(limit);
    const skipNum = parseInt(skip);

    const query = {
      is_deleted: false,
      stock: { $gt: 0 },
      ...(category !== "All" && { category }),
    };

    if (q) {
      query.product_name = { $regex: q, $options: "i" }; // ✅ match field name correctly
    }

    // console.log(query, 'query')

    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skipNum)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Products listed successfully",
      data: products,
      total: totalCount,
      limit: limitNum,
      skip: skipNum,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to list products",
      data: err.message,
    });
    next(err);
  }
};


// Get product by ID
export const getProductById = async (req, res, next) => {
  try {
     const { id} = req.params;
 
    const product = await Product.findById(id);
    if (!product)
       return res.status(404).json({
         status: false,
         message: "Product not found",
         data: null,
       });
       else{
          res.status(200).json({
            status: true,
            message: "Product fetched successfully",
            data: product,
          });
       }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: err.message });
      next(err);
  }
};



//  Create new product
export const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      console.error(errors, 'errors')
      return next(new HttpError("Invalid data inputs passed", 400));
    }else{
      const {userRole} = req.userData
      const imagePath = req.file ? req.file.path : null;
  
      // console.log(userRole)
  
      if (userRole !== "admin") {
        return next(new HttpError("User not authorized", 401))
      } else {
        const { product_name, description, price, stock, image, brand, category } = req.body;
        const newProduct = { 
          product_name,
          description, 
          price, 
          stock, 
          image:imagePath, 
          brand, 
          category 
        }
        const product = new Product(newProduct);
        await product.save();
        if (!product)
          return res.status(400).json({
            status: false,
            message: "Invalid product data",
          });
        else{
        res.status(201).json({
          status: true,
          message: "Product created successfully",
          data: product,
          });
        }
      }
    }
  } catch (err) {
    res
      .status(500)
      .json({
        status: false,
        message: "Error creating product",
        error: err.message
      });

    next(err);
    }
};

//  Update product
export const updateProduct = async (req, res, next) => { 
  try {
     const errors = validationResult(req)
    if(!errors.isEmpty()){
      return next(new HttpError("Invalid data inputs passed", 400));
    }else{
    const {userRole} = req.userData
    const {id} = req.params 
    if (userRole !== "admin") {
      return next(new HttpError("User not authorized", 401))
    } else{

        const { product_name, description, price, stock, image, brand, category } = req.body;
        const updatedData = { 
          product_name,
          description, 
          price, 
          stock, 
          image, 
          brand, 
          category 
        }
        const product = await Product.findByIdAndUpdate(
          id,
          updatedData,
          {
            new: true,
          });
        if (!product)
           return res.status(404).json({
             status: false,
             message: "Product not found",
             data: null,
           });
        else{
           res.status(200).json({
             status: true,
             message: "Product updated successfully",
             data: product,
           });
        }
      }
    }

  } catch (err) {
    res
      .status(500)
      .json({
        status: false,
        message: "Error updating product",
        error: err.message
      });
    next(err);
  }
};


//  Delete product
// 🧹 Soft Delete Product
export const removeProduct = async (req, res, next) => {
  try {
    const {userRole} = req.userData
    const { id } = req.params;

    if (userRole !== "admin") {
      return next(new HttpError("User not authorized", 401))
    } else{
    const product = await Product.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
        data: null,
      });
    }

    res.json({
      status: true,
      message: "Product soft deleted successfully",
      data: product,
    });
  }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error soft deleting product",
      error: err.message,
    });
    next(err);
  }
};
