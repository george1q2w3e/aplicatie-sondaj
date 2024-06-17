import { Response } from "express";
import { PoolClient } from "pg";
import {
    CreateSurvey,
    AddQuestion,
    SurveyResponse,
} from "../models/survey";

export async function get_survey_list(client: any, res: Response) {
    const surveys = await client.query(`
    SELECT json_agg(survey)
    FROM (
        SELECT s.id AS survey_id, s.name AS survey_name, s.description,
            CASE WHEN count(q.id) = 0 THEN '[]' ELSE  json_agg(json_build_object('question_id', q.id, 'date_created', q.date_created, 'name', q.name, 'optional', q.optional,
                'type', q.type_, 'options', q.options_, 'answers', (SELECT json_agg(json_build_object('group', sr.respondant_group, 'answer', sr.answer)) FROM survey_responses sr WHERE sr.question_id = q.id))) END AS question_list
        FROM surveys s
        LEFT JOIN questions q ON q.survey_id = s.id
        GROUP BY s.id, survey_name, s.description
    ) AS survey;
    `);

    res.json(surveys.rows[0].json_agg);
}

export async function get_survey(client: any, surveyId: string, res: Response) {
    const survey = await client.query(
        `
    SELECT json_agg(survey)
    FROM (
        SELECT s.id AS survey_id, s.name AS survey_name, s.description,
            CASE WHEN count(q.id) = 0 THEN '[]' ELSE json_agg(json_build_object('name', q.name, 'type', q.type_,
                'optional', q.optional) ORDER BY q.date_created) END AS question_list
        FROM surveys s
        LEFT JOIN questions q ON q.survey_id = s.id
        WHERE s.id = $1
        GROUP BY s.id, survey_name, s.description
    ) AS survey;
    `,
        [surveyId]
    );

    // Assuming a single survey is returned:
    res.json(survey.rows[0].json_agg[0]);
}

export async function create_survey(
    client: any,
    survey: CreateSurvey,
    res: Response
) {
    // Prepare the statement for the survey
    const surveyStatement =
        "INSERT INTO surveys(name, description) VALUES($1, $2) RETURNING id";
    const surveyValues = [survey.name, survey.description];

    // Execute the statement and get the survey id
    const { rows } = await client.query(surveyStatement, surveyValues);

    res.json(rows[0].id);
}

export async function delete_survey(client: any, survey_id: string) {
    // Prepare for deletion of the survey
    await client.query("BEGIN");

    // Prepare the statement for the questions
    const questionStatement = "DELETE FROM questions WHERE survey_id = $1";
    const questionValues = [survey_id];

    // Execute the statement and get the survey id
    await client.query(questionStatement, questionValues);

    // Prepare the statement for the survey
    const surveyStatement = "DELETE FROM surveys WHERE id = $1";
    const surveyValues = [survey_id];

    // Execute the statement and get the survey id
    await client.query(surveyStatement, surveyValues);

    // Commit the transaction
    await client.query("COMMIT");
}

export async function add_question(
    client: any,
    survey_id: string,
    question: AddQuestion
) {
    // Prepare the statement for the question
    const questionStatement = `
    INSERT INTO questions(name, survey_id, optional, type_, options_)
    VALUES($1, $2, $3, $4, $5) RETURNING id`;
    const questionValues = [
        question.name,
        survey_id,
        question.optional,
        question.type_,
        question.options_,
    ];

    // Execute the statement and get the question id
    const { rows } = await client.query(questionStatement, questionValues);

    // Commit the transaction
    await client.query("COMMIT");

    return rows[0].id;
}

export async function delete_question(client: any, question_id: string) {
    // Prepare the statement for the question
    const questionStatement = "DELETE FROM questions WHERE id = $1";
    const questionValues = [question_id];

    // Execute the statement and get the question id
    await client.query(questionStatement, questionValues);
}

export async function submit_response(
    client: any,
    question_id: string,
    response: string,
    group: string
) {
    // Prepare the statement for the response
    const responseStatement = `
    INSERT INTO survey_responses(question_id, answer, respondant_group)
    VALUES ($1, $2, $3);
    `;
    const responseValues = [question_id, response, group];

    // Execute the statement and get the question id
    await client.query(responseStatement, responseValues);
}

export async function submit_responses(client : PoolClient, data: SurveyResponse[], res: Response) {
    // Validate responses on the server
    for (const response of data) {
        // Check if the question is optional
        const { rows: question } = await client.query("SELECT * FROM questions WHERE id = $1", [
            response.question_id,
        ]);

        if (response.group === "-") {
            res.status(400).send("Respondant group must not be empty.");
            return;
        }
        // Verify if the response is empty
        if (response.answer === undefined && question[0].optional === false) {
            res.status(400).send("Question " + response.question_id + " is not optional");
            return;
        }
        if (response.answer === "" && question[0].optional === false) {
            res.status(400).send("Response must not be empty.");
            return;
        }
        // If response is freeform and optional remove the response from the data
        if (question[0].type_ === "freeform" && question[0].optional === true && response.answer === "") {
            data.splice(data.indexOf(response), 1);
        }
        else {
            // Validate options only if the question has options
            if ( question[0].type_ !== "freeform" && question[0].options_ !== null && !question[0].options_.includes(response.answer)) {
                res.status(400).send("Invalid option for question " + response.question_id + "." + response.answer + " is not in " + question[0].options_);
                return;
            }
        }
    }
    // Submit responses
    for (const response of data) {
        try {
            await submit_response(client, response.question_id, response.answer, response.group);
        } catch (e) {
            console.log(e);
            res.status(400).send("Error submitting response: " + e);
            return;
        }
    }
    res.status(200).send("Responses added");
}

export async function get_response(
    client: any,
    question_id: string,
    res: Response
) {
    // Retrieve all the responses of a question
    const responseStatement = `
    SELECT answers
    FROM survey_responses
    WHERE question_id = $1
    `;
    const responseValues = [question_id];

    // Execute the statement and get the responses
    const { rows: responseRows } = await client.query(
        responseStatement,
        responseValues
    );

    res.json(responseRows[0].answers);
}