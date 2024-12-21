import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

const yourUsername = "diothewind";
const yourPassword = "diothegreat";
const yourAPIKey = "7f361c55-710a-4e90-a871-294053c8826a";
const yourBearerToken = "cbbd3af0-ff17-405d-92c8-2504095daaf7";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  const response = await axios.get("https://secrets-api.appbrewery.com/random");
  const content = JSON.stringify(response.data);

  res.render("index.ejs", { content: content });
});

app.get("/basicAuth", async (req, res) => {
  const response = await axios.get("https://secrets-api.appbrewery.com/all?page=2", {
    auth: {
      username: yourUsername,
      password: yourPassword
    }
  });

  const content = JSON.stringify(response.data);

  res.render("index.ejs", { content: content });
});

app.get("/apiKey", async (req, res) => {
  const response = await axios.get(`https://secrets-api.appbrewery.com/filter?score=5&apiKey=${yourAPIKey}`);
  const content = JSON.stringify(response.data);

  res.render("index.ejs", { content: content });
});

app.get("/bearerToken", async (req, res) => {
  const response = await axios.get("https://secrets-api.appbrewery.com/secrets/42", {
    headers: {
      Authorization: `Bearer ${yourBearerToken}`
    }
  });

  const content = JSON.stringify(response.data);

  res.render("index.ejs", { content: content });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
