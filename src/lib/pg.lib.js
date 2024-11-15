import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config()

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

async function queryFunc(query, ...params) {
    try {
        const client = await pool.connect();
        const data = await client.query(query, params);
        client.release();
        return data.rows;
    } catch (error) {
        console.error("Error executing query:", error);
    }
}

export default queryFunc