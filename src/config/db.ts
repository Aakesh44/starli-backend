import mongoose from "mongoose";

async function  connectDB(uri: string) {
    try {

        await mongoose.connect(uri);
        console.log("Connected to database 🍃🟢");
        mongoose.connection.once("open", () => {
            console.log("Connected to database");
        });

        mongoose.connection.on("disconnected", () => {
            console.log("Disconnected from database");
        });

        mongoose.connection.on("error", (error) => {
            console.log("Error connecting to database", error);
        });
        
    } catch (error) {
        console.log("Failed to connect to database", error);
    }
};

async function closeDB() {
    await mongoose.connection.close();
    console.log("Database connection closed");
}

export { connectDB, closeDB };