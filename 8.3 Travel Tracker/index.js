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

async function getVisitedCountries() {
  const countries_query = await db.query("SELECT country_code FROM visited_countries");
  let country_codes_arr = [];

  countries_query.rows.forEach(row => {
    country_codes_arr.push(row.country_code);
  });

  return country_codes_arr;
}

app.get("/", async (req, res) => {
  const countries_visited = await getVisitedCountries();

  res.render("index.ejs", {
    countries: countries_visited,
    total: countries_visited.length,
  });
});

app.post("/add", async (req, res) => {
  // grab country code
  const country_input = req.body.country;
  const country_code_query = await db.query(
    "SELECT country_code FROM countries WHERE country_name ILIKE '%' || $1 || '%'",
    [country_input]
  );

  if (country_code_query.rowCount === 0) {
    const countries_visited = await getVisitedCountries();
    return res.render("index.ejs", {
      countries: countries_visited,
      total: countries_visited.length,
      error: "Country does not exist, try again."
    });
  }

  // add country code to visited_countries
  try {
    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [country_code_query.rows[0].country_code]);
  } catch {
    const countries_visited = await getVisitedCountries();
    return res.render("index.ejs", {
      countries: countries_visited,
      total: countries_visited.length,
      error: "Country has already been added, try again."
    });
  }

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
