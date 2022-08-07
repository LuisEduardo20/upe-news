import { Pool } from "pg";
import cron from "node-cron";
import { poolMaster, poolSlave } from "./services/databases";

const getDataFromDatabase = (pool: Pool) => {
  pool.connect();
  pool.query(`SELECT * FROM news`, (err, res) => {
    if (err) {
      console.log(err);
      return null;
    } else {
      return res.rows;
    }
  });
};

//TODO implementar função
const syncDatabases = () => {};

// cron.schedule("* * * * * *", () => {
cron.schedule("* * * * *", () => {
  let masterNews = null;
  let slaveNews = null;

  masterNews = getDataFromDatabase(poolMaster);

  slaveNews = getDataFromDatabase(poolSlave);

  //TODO Pensar na lógica de inserção dos dados
});
