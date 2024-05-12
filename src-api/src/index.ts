import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import { surveyRoutes } from "./routes/survey_routes";
import { suggestionRoutes } from "./routes/suggestion_routes";
import { pool } from "./db";
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

        await client.query(`CREATE TABLE IF NOT EXISTS surveys (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255),
            description VARCHAR(255)
        );`);
        await client.query(`CREATE TABLE IF NOT EXISTS questions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255),
            survey_id UUID,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            optional BOOLEAN,
            type_ VARCHAR(255),
            options_ VARCHAR(255)[],
            answers VARCHAR(255)[],
            FOREIGN KEY (survey_id) REFERENCES surveys (id)
        );`);
        await client.query(`CREATE TABLE IF NOT EXISTS suggestions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255),
            description VARCHAR(255)
        );`);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
    }
    console.log("Server running on port 3050");
});
