import { Pool, PoolClient } from 'pg';

// Create a connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,
});

// Database initialisation
export async function init(client: PoolClient) {
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
        FOREIGN KEY (survey_id) REFERENCES surveys (id)
    );`);
    await client.query(`CREATE TABLE IF NOT EXISTS survey_responses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id UUID,
        survey_id UUID,
        respondant_group VARCHAR(255),
        answer VARCHAR(255),
        FOREIGN KEY (question_id) REFERENCES questions (id),
        FOREIGN KEY (survey_id) REFERENCES surveys (id)
    );`);
    await client.query(`CREATE TABLE IF NOT EXISTS suggestions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255),
        description VARCHAR(255)
    );`);
}

export { pool };