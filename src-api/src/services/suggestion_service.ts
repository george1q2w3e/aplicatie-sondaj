import { AddSuggestion } from "../models/survey";
import { Response } from "express";

export async function suggest_survey(
    client: any,
    suggestion: AddSuggestion,
    res: Response
) {
    // Prepare the statement for the suggestion
    const suggestionStatement = `
    INSERT INTO suggestions (name, description)
    VALUES ($1, $2)
    RETURNING id;`;
    const suggestionValues = [suggestion.name, suggestion.description];

    // Execute the statement and get the suggestion id
    const { rows: suggestionRows } = await client.query(
        suggestionStatement,
        suggestionValues
    );
    res.json(suggestionRows[0].id);
}

export async function get_suggestions(client: any, res: Response) {
    // Retrieve all the suggestions
    const suggestionStatement = `
    SELECT json_agg(suggestion)
    FROM (
        SELECT id, name, description
        FROM suggestions
    ) AS suggestion;
    `;

    // Execute the statement and get the suggestions
    const { rows: suggestionRows } = await client.query(suggestionStatement);

    res.json(suggestionRows[0].json_agg);
}
