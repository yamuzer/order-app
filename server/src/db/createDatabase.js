import 'dotenv/config'
import pg from 'pg'
import { getDbConfig, requireValidDatabaseName } from './config.js'

const { Client } = pg
const databaseName = process.env.DB_NAME || 'order_app'
requireValidDatabaseName(databaseName)

const client = new Client(getDbConfig('postgres'))

try {
  await client.connect()
  const exists = await client.query('select 1 from pg_database where datname = $1', [
    databaseName,
  ])

  if (exists.rowCount === 0) {
    await client.query(`create database "${databaseName}"`)
    console.log(`Created database ${databaseName}`)
  } else {
    console.log(`Database ${databaseName} already exists`)
  }
} finally {
  await client.end()
}
