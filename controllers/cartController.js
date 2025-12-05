import Cart from "../model/cart.js";
import Product from "../model/product.js";

// ✅ Add  cart
export const addToCart = async (req, res,next) => {
  try {
    const { product_id, quantity = 1 } = req.body;
     console.log("req.body:", req.body);

    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find product details
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
        // Check if the product already exists in the cart
        const existingCartItem = await Cart.findOne({ product_id });
    
        if (existingCartItem) {
          //  Increase quantity if product already in cart
          existingCartItem.quantity += quantity;
          await existingCartItem.save();
          return res.status(200).json({
            message: "Cart updated (quantity increased)",
            cartItem: existingCartItem,
          });
        }  else {

              // 🆕 Add new item if it doesn’t exist in cart
        const newCartItem = new Cart({
          product_id: product._id,
          quantity,
          price: product.price,
        //   product_name: product.product_name,
        });
    
        await newCartItem.save();
    
        res.status(201).json({
          message: "Item added to cart successfully",
          cartItem: newCartItem,
        });

        }
    }

  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: error.message || "Server error" });
    next()
  }
};

// ✅ Decrease quantity or remove item
export const removeFromCart = async (req, res,next) => {
  try {
    const { id } = req.params;
   

    const cartItem = await Cart.findById(id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await Cart.findByIdAndDelete(id);

    return res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Error removing item:", error);
    return res.status(500).json({ message: "Server error", error });
    next()
  }
};


// ✅ Get all cart items
export const getCart = async (req, res) => {
  try {
    const items = await Cart.find().populate({
        path: "product_id",
        select: "_id product_name image brand"
    }).select("-__v -createdAt -updatedAt");
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update quantity of a cart item
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;            // cart item ID
    const { quantity } = req.body;        // new quantity value

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity value" });
    }

    // Find the cart item
    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Optionally check if quantity exceeds product stock
    const product = await Product.findById(cartItem.product_id);
    if (product && quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} items available in stock.`,
      });
    }

    // Update and save
    cartItem.quantity = quantity;
    cartItem.price = product.price; 
    await cartItem.save();

    res.status(200).json({ message: "Quantity updated successfully", cartItem });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// ✅ Clear entire cart
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
