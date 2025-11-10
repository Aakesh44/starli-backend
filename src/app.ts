import express from 'express';
import dotenv from  "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRouter from './routes/auth.route.js';
import { errorHandler } from './middleware/error.middleware.js';


dotenv.config();

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(cors({origin: "*", credentials: true}));
app.use(express.json({limit: "5mb"}));
app.use(express.urlencoded({extended: true, limit: "5mb"}));
app.use(morgan("dev"));

app.use(express.json());

app.get('/', (_, res) => {
    res.send("🌠 Starli is sparkling brightly")
})

app.use("/api/auth", authRouter)

app.use((_, res) => {
    res.status(404).json({error: "Not found"});
});

app.use(errorHandler)

export default app;