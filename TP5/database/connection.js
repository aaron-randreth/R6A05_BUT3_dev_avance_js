import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config()

const db_host = process.env.DB_HOST;
const db_port = process.env.DB_PORT;
const db_name = process.env.DB_NAME;

const db_url = `mongodb://${db_host}:${db_port}/${db_name}`;

export async function db_connect() {
	return mongoose.connect(db_url)
}
