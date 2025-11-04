import express from 'express';
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send("🌠 Starli is sparkling brightly");
});
export default app;
//# sourceMappingURL=app.js.map