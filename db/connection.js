import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres', // Your PostgreSQL username
  host: 'localhost',
  database: 'employee_db', // Your database name
  password: '123yee123', // Your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

export default pool;
