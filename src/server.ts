import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

app.listen(PORT, async () => {

    try {
        await connectDB(MONGO_URI || "");
        console.log(`🌠 Starli is running on port ${PORT}`);

    } catch (error) {
        
    }
})