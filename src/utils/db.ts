import { Pool } from 'pg';

const globalForPg = global as unknown as { pool: Pool };

export const pool = globalForPg.pool || new Pool();

if (process.env.NODE_ENV !== 'production') globalForPg.pool = pool;

export default pool;