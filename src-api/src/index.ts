import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import { surveyRoutes } from "./routes/survey_routes";
import { suggestionRoutes } from "./routes/suggestion_routes";
import { pool, init } from "./db";
import dotenv from "dotenv";

dotenv.config();

const app = express();
var corsOptions = {
    origin: "http://localhost:4321",
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(function (_req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4321");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/survey", surveyRoutes);
app.use("/api/suggestion", suggestionRoutes);
app.use(morgan("dev"));
app.use(cors(corsOptions));

app.listen(3050, async () => {
    const client = await pool.connect();

    if (!client) {
        console.log("TIP: The database might not be running.");
        return;
    }

    try {
        // DROP the tables for debugging purposes
        // await client.query('DROP TABLE IF EXISTS questions cascade');
        // await client.query('DROP TABLE IF EXISTS surveys cascade');
        // await client.query('DROP TABLE IF EXISTS suggestions cascade');
        // await client.query('DROP TABLE IF EXISTS survey_responses cascade');

        // Wait 4 seconds to clear it
        // await new Promise((resolve) => setTimeout(resolve, 4000));

        await init(client);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
    }
    console.log("Server running on port 3050");
});
