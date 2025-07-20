import mongoose from "mongoose";

//--------- Database connection ---------
const connectDB = async (DB_URI) => {
try {
    await mongoose.connect(DB_URI)
    console.log("Successfully connected to MongoDB...!");
} catch (err) {
    console.log(err);
    process.exit(1);
}

}

export default connectDB;