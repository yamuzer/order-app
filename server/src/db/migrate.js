import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { pool } from './pool.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const schemaPath = join(__dirname, 'schema.sql')
const schema = await readFile(schemaPath, 'utf8')

try {
  await pool.query(schema)
  console.log('Database schema is ready')
} finally {
  await pool.end()
}
