import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  name: { 
    type: String, 
    required: true 
    },

  phone : { 
    type: String,
    },

  email: {
     type: String,
     required: true,
     unique: true 
    },

  password: {
    type: String, 
    required: true 
    },
    role: {
        type: String, 
        required: true,
        enum: ["admin", "customer"],
        default: "customer"
    },
    image: {
       type: String,
      default: "uploads/default.png"
     } 
},
{ timestamps: true } 
);

export default mongoose.model("User", userSchema);