import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const poolMaster = new Pool({
  host: process.env.DB_MASTER_HOST,
  database: process.env.DB_MASTER_DATABASE,
  user: process.env.DB_MASTER_USER,
  password: process.env.DB_MASTER_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: {
    rejectUnauthorized: false,
  },
});

export const poolSlave = new Pool({
  host: process.env.DB_SLAVE_HOST,
  database: process.env.DB_SLAVE_DATABASE,
  user: process.env.DB_SLAVE_USER,
  password: process.env.DB_SLAVE_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),

  ssl: {
    rejectUnauthorized: false,
  },
});

poolMaster.on("error", (err, client) => {
  console.error("Error on master database", err);
  // process.exit(-1);
});

poolMaster.on("connect", (err) => {
  console.error("Conectou no master");
});

poolSlave.on("error", (err, client) => {
  console.error("Error on slave database:", err);
  // process.exit(-1);
});

poolSlave.on("connect", (err) => {
  console.error("Conectou no slave");
});
