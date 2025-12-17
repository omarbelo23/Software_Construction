import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    image: String,
    isAvailable: Boolean
});

export default mongoose.model("MenuItem", menuSchema);
