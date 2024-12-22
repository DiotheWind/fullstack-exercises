import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(API_URL + "/random");
        const secret = response.data.secret;
        const user = response.data.username;

        res.render("index.ejs", {
            secret: secret,
            user: user
         });
    } catch (error) {
        res.send(error.response.data);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
