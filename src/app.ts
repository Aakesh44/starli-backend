import express from "express";
import cors from "cors";

const app = express();

const corsOptions = {
    origin: "https://starli-io.vercel.app",
    credentials: true
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.post("/api/auth/signup", (_, res) => {
    res.json({ ok: true });
});

app.get("/", (_, res) => {
    res.send("WORKING");
});

export default app;