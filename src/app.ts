import express from "express";

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://starli-io.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

app.post("/api/auth/signup", (_, res) => {
    res.json({ ok: true });
});

app.get("/", (_, res) => {
    res.send("WORKING");
});

export default app;