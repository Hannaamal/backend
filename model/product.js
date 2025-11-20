import mongoose from "mongoose";

// Define the schema
const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  stock:{
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: null, 
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  is_deleted:{
    type: Boolean,
    default: false,
  }
},{
  timestamps: true,
});

// Create a model (collection)
const Product = mongoose.model("products", productSchema);

export default Product;
