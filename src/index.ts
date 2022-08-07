import cron from "node-cron";
import { poolMaster, poolSlave } from "./services/databases";

// cron.schedule("* * * * *", () => {
cron.schedule("* * * * *", () => {
  console.log("Conectando aos bancos");

  poolMaster.connect();
  poolMaster.query(`SELECT * FROM news`, (err, res) => {
    console.log("res:", res.rows);
  });

  poolSlave.connect();
  poolSlave.query(`SELECT * FROM news`, (err, res) => {
    console.log("res:", res.rows);
  });
});
