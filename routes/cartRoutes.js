import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { check } from "express-validator";

const router = express.Router();

router.post("/add",[
  check("product_id").notEmpty().withMessage("Product_id is required"),
  check("quantity").notEmpty().withMessage("quantity  is required").isNumeric().withMessage("must be a number")
], addToCart);          
router.get("/list", getCart);  
router.put("/update/:id",[
  check("quantity").notEmpty().withMessage("quantity  is required").isNumeric().withMessage("must be a number")
], updateCartItem);              
router.delete("/remove/:id", removeFromCart); 
router.delete("/clear", clearCart);        

export default router;
