import { Router } from "express";
import { Request, Response } from "express";
import { pool } from "../db";
import {
    get_survey_list,
    get_survey,
    create_survey,
    add_question,
    submit_response,
    submit_responses,
    delete_survey,
    delete_question,
    get_response,
} from "../services/survey_service";
import {
    CreateSurvey,
    AddQuestion,
    SurveyResponse,
} from "../models/survey";
import { PoolClient } from "pg";

export const surveyRoutes = Router();

// GET / — get_survey_list
surveyRoutes.get("/", async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        await get_survey_list(client as PoolClient, res);
    } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).send("Error getting survey list: " + err);
    } finally {
        client.release();
    }
});

// GET /:id — get_survey
surveyRoutes.get("/:id", async (req: Request, res: Response) => {
    const survey_id = req.params.id;
    const client = await pool.connect();

    try {
        await get_survey(client, survey_id, res);
    } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).send("Error getting survey: " + err);
    } finally {
        client.release();
    }
});

// POST / — create_survey
surveyRoutes.post("/", async (req: Request, res: Response) => {
    const survey: CreateSurvey = req.body;
    const client = await pool.connect();

    try {
        await create_survey(client, survey, res);
    } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).send("Error adding survey: " + err);
    } finally {
        client.release();
    }
});

// POST /question/:id — add_question
surveyRoutes.post("/question/:id", async (req: Request, res: Response) => {
    const survey_id = req.params.id;
    const question = req.body as AddQuestion;
    const client = await pool.connect();

    await client.query("BEGIN");

    try {
        // Check if the survey exists
        const { rowCount } = await client.query("SELECT 1 FROM surveys WHERE id = $1", [survey_id]);
        if (rowCount === 0) {
            res.status(404).send(`Survey with ID ${survey_id} not found`);
            return;
        }

        const questionId = await add_question(client, survey_id, question);
        res.status(200).send(`Question added with ID ${questionId}`);
    } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).send(`Error adding question: ${err}`);
    } finally {
        client.release();
    }
});

// PUT /question/:id — submit_response
surveyRoutes.put("/question/:id", async (req, res) => {
    const question_id = req.params.id;
    const response = req.body as SurveyResponse;
    const client = await pool.connect();

    try {
        // Check if the question is optional
        const optional = await client.query(
            "SELECT optional FROM questions WHERE id = $1",
            [question_id]
        );
        if (response.answer === undefined) {
            res.status(400).send("Response must have an answer, optional is " + optional.rows[0].optional);
            return;
        }
        if (response.answer === "") {
            res.status(400).send("Response must not be empty, optional is " + optional.rows[0].optional);
            return;
        }
        await submit_response(client, question_id, response.answer, response.group);
        res.status(200).send("Question response added");
    } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).send("Error adding question response: " + err);
    } finally {
        client.release();
    }
});

// PUT /questions — submit_responses
surveyRoutes.put("/questions", async (req, res) => {
    const responses = req.body as SurveyResponse[];

    const client = await pool.connect();

    try {
        await submit_responses(client, responses, res);
    } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).send("Error adding responses: " + err);
    } finally {
        client.release();
    }
});

// DELETE /:id — delete_survey
surveyRoutes.delete("/:id", async (req: Request, res: Response) => {
    const survey_id = req.params.id;

    const client = await pool.connect();

    try {
        await delete_survey(client, survey_id);
    } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).send("Error deleting survey: " + err);
    } finally {
        res.status(200).send("Question deleted");
        client.release();
    }
});

// DELETE /question/:id — delete_question
surveyRoutes.delete("/question/:id", async (req: Request, res: Response) => {
    const question_id = req.params.id;

    const client = await pool.connect();

    try {
        await delete_question(client, question_id);
    } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).send("Error deleting question:" + err);
    } finally {
        res.status(200).send("Question deleted");
        client.release();
    }
});

// GET /responses — get_responses
surveyRoutes.get("/responses/:id", async (req: Request, res: Response) => {
    const question_id = req.params.id;

    const client = await pool.connect();

    try {
        await get_response(client, question_id, res);
    } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).send("Error getting responses: " + err);
    } finally {
        client.release();
    }
});