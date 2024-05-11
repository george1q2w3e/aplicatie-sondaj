import { Router } from "express";
import { Request, Response } from "express";
import { AddSuggestion } from "../models/survey";
import { pool } from "../db";
import {
    suggest_survey,
    get_suggestions,
} from "../services/suggestion_service";

export const suggestionRoutes = Router();

// GET /suggest — get_suggestions
suggestionRoutes.get("/", async (res: Response) => {
    const client = await pool.connect();

    try {
        await get_suggestions(client, res);
    } catch (err) {
        await client.query("ROLLBACK");
        const errorMessage = `Error getting suggestions: ${err}`;
        console.log(errorMessage);
        res.status(500).send(errorMessage);
    } finally {
        client.release();
    }
});

// POST /suggest — suggest_survey
suggestionRoutes.post("/", async (req: Request, res: Response) => {
    const client = await pool.connect();
    const suggestion = req.body as AddSuggestion;

    try {
        await suggest_survey(client, suggestion, res);
    } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).send("Error suggesting survey: " + err);
    } finally {
        client.release();
    }
});

// DELETE /suggest/:id — delete_suggestion
suggestionRoutes.delete("/:id", async (req: Request, res: Response) => {
    const client = await pool.connect();
    const id = req.params.id;

    try {
        await client.query("BEGIN");
        await client.query("DELETE FROM suggestions WHERE id = $1", [id]);
        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).send("Error deleting suggestion: " + err);
    } finally {
        res.status(200).send("Suggestion deleted");
        client.release();
    }
});
