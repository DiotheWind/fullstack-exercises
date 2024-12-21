import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const type = req.body.type;
    const participants = req.body.participants;

    const response = await axios.get(`https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`);
    const resultArr = response.data;
    const randomIndex = Math.floor(Math.random() * resultArr.length);
    const result = resultArr[randomIndex];

    res.render("index.ejs", { data: result });
  } catch (error) {
    let message;

    if (error.response.status === 404) {
      message = "No activities that match your criteria"
    } else if (error.response.status === 429) {
      message = "Too many requests. Please try again later."
    } else {
      message = error.message;
    }

    res.render("index.ejs", {
      error: message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
