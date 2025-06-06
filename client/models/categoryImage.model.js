import mongoose from "mongoose";

const categoryImageSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "Woman's_Fashion",
        "Men's_Fashion",
        "Electronics",
        "Home_and_LifeStyle",
        "Medicine",
        "Sports_&_Outdoor",
        "Baby's_&_Toys",
        "Groceries_&_Pets",
        "Health_&_Beauty",
      ],
      required: true,
      unique: true,
    },

    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CategoryImage = mongoose.model("CategoryImage", categoryImageSchema);

export default CategoryImage;
