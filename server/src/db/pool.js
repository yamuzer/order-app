import 'dotenv/config'
import pg from 'pg'
import { getDbConfig } from './config.js'

export const pool = new pg.Pool(getDbConfig())
