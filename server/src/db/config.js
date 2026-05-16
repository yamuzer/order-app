export function getDbConfig(database = process.env.DB_NAME) {
  const sslEnabled = process.env.DB_SSL === 'true'

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
  }
}

export function requireValidDatabaseName(databaseName) {
  if (!/^[a-zA-Z0-9_]+$/.test(databaseName)) {
    throw new Error('DB_NAME may contain only letters, numbers, and underscores')
  }
}
