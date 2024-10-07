const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the User schema
const userSchema = new mongoose.Schema({

    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
   
    password: { 
        type: String, 
        required: true,
    },
  },
    { 
        timestamps: true  
    });
// Export the User model based on the schema
  const user = mongoose.model("users", userSchema);
module.exports = user

