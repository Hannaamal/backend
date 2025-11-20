import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products", 
    },
    // product_name: {
    //   type: String,
    //   required: true,
    // },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },


  },
  { timestamps: true } 
);

export default mongoose.model("Cart", cartSchema);
