import cron from "node-cron";
import { poolMaster, poolSlave } from "./services/databases";

cron.schedule("* * * * *", () => {
  console.log("Conectando aos bancos");

  poolMaster.connect();
  poolSlave.connect();
});
