import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "admin",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getItems() {
  const items = await db.query("SELECT * FROM items");
  return items.rows;
}

app.get("/", async (req, res) => {
  try {
    const items = await getItems();

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/add", async (req, res) => {
  try {
    const item = req.body.newItem;
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err)
    res.sendStatus(500);
  }
});

app.post("/edit", async (req, res) => {
  try {
    const idToBeUpdated = Number(req.body.updatedItemId);
    const updatedTitle = req.body.updatedItemTitle;

    await db.query("UPDATE items SET title = $1 WHERE id = $2", [updatedTitle, idToBeUpdated]);

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/delete", async (req, res) => {
  try {
    const idToBeDeleted = Number(req.body.deleteItemId);
    await db.query("DELETE FROM items WHERE id = $1", [idToBeDeleted]);

    res.redirect("/");
  } catch (err) {
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
