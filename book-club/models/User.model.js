const { Schema, model } = require("mongoose");
const Book = require('./Book.model')
// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    
    email: {
      type: String,
      required: true,
      unique: true
    },

    firstName: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    picture: {
      
    },

    favoriteBook: {

    },

    books: {
      
    }
  },
  
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
