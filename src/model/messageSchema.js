const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the User schema
const mesageSchema = new mongoose.Schema({

    senderId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    reciverId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
   
    message: { 
        type: String, 
        required: true,
    },
  },
    { 
        timestamps: true  
    });
// Export the User model based on the schema
  const message = mongoose.model("chat", mesageSchema);
module.exports = message
