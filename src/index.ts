import { Pool } from "pg";
import cron from "node-cron";
import { poolMaster, poolSlave } from "./services/databases";

const formatDate = (date: string) => {
  const onlyDate = date.split(" ")[0];

  const formatedDate =
    onlyDate.split("/").reverse().join().replace(/,/g, "-") +
    " " +
    date.split(" ")[1];

  return formatedDate;
};

const getDataFromDatabase = async (pool: Pool) => {
  try {
    const now = formatDate(
      new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      })
    );
    const nowTwoMinutesBefore = formatDate(
      new Date(new Date().getTime() - 120000).toLocaleString(
        "pt-BR",
        {
          timeZone: "America/Sao_Paulo",
        }
      )
    );

    const query = `SELECT * FROM 
                      news 
                    WHERE 
                      created_at 
                    BETWEEN 
                      '${now}'
                    AND
                      '${nowTwoMinutesBefore}'`;

    const { rows } = await pool.query(query);

    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.log(error);
  }
};

const syncDatabases = (
  masterNews: any[] | null = null,
  slaveNews: any[] | null = null
) => {
  if (masterNews) {
    try {
      //TODO insert in slave database
    } catch (error) {}
  }

  if (slaveNews) {
    try {
      //TODO insert in master database
    } catch (error) {}
  }
};

cron.schedule("*/10 * * * * *", async () => {
  let masterNews = null;
  let slaveNews = null;

  masterNews = await getDataFromDatabase(poolMaster);

  slaveNews = await getDataFromDatabase(poolSlave);

  syncDatabases(masterNews, slaveNews);
});
