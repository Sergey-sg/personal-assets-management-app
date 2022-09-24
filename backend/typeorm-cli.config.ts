import { DataSource } from 'typeorm';

// require('dotenv').config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/**/*.entity{.js}'],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
});
