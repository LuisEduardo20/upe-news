import { Pool } from "pg";
import cron from "node-cron";
import { poolMaster, poolSlave } from "./services/databases";

type News = {};

const getDataFromDatabase = async (pool: Pool) => {
  try {
    const query = `
                    SELECT 
                      title, body, author
                    FROM 
                      news 
                    ORDER BY
                      created_at DESC
                    LIMIT 6`;

    const { rows } = await pool.query(query);

    const filteredNews = rows.filter((news) => {
      return;
    });

    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.log(error);
  }
};

const syncDatabases = async (
  masterNews: any[] | null = null,
  slaveNews: any[] | null = null
) => {
  if (masterNews) {
    try {
      await Promise.all(
        masterNews.map((news) => {
          const { title, body, author } = news;

          const query = `
                    INSERT INTO
                      news
                      (title, body, author)
                    VALUES
                      ('${title}', '${body}', '${author}')`;

          return poolSlave.query(query);
        })
      );
    } catch (error) {
      console.log("error 1:", error);
    }
  }

  if (slaveNews) {
    try {
      await Promise.all(
        slaveNews.map((news) => {
          const { title, body, author } = news;

          const query = `
                    INSERT INTO
                      news
                      (title, body, author)
                    VALUES
                      ('${title}', '${body}', '${author}')`;

          return poolMaster.query(query);
        })
      );
    } catch (error) {
      console.log("error 2:", error);
    }
  }
};

cron.schedule("*/2 * * * *", async () => {
  let masterNews = null;
  let slaveNews = null;

  masterNews = await getDataFromDatabase(poolMaster);

  slaveNews = await getDataFromDatabase(poolSlave);

  syncDatabases(masterNews, slaveNews);
});
