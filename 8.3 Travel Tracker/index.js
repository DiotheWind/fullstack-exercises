import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "admin",
  port: 5432
});

db.connect();

app.get("/", async (req, res) => {
  const countries_query = await db.query("SELECT country_code FROM visited_countries");
  let country_codes_arr = [];

  countries_query.rows.forEach(row => {
    country_codes_arr.push(row.country_code);
  });

  res.render("index.ejs", {
    countries: country_codes_arr,
    total: countries_query.rowCount
  });

  db.end();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
