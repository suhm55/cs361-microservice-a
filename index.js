const express = require("express");
const ping = require("ping");
const axios = require("axios");
const app = express();
const dotenv = require("dotenv");

app.use(express.json());
dotenv.config();

const port = process.env.PORT;

app.post("/ping", async (req, res) => {
  const { target } = req.body;

  try {
    const pingResponse = await ping.promise.probe(target, { timeout: 0.5 });
    const { alive } = pingResponse;

    if (alive) {
      console.log(`${target} is alive!`);
      res.sendStatus(200);
    } else {
      console.log(`${target} is dead.`);
      res.sendStatus(503);
    }
  } catch (error) {
    console.error(error);
  }
});

app.post("/healthcheck", async (req, res) => {
  const { target, resp } = req.body;

  try {
    const healthcheckResponse = await axios.get(`${target}/healthcheck`);
    if (healthcheckResponse.data === resp) {
      console.log("Healthy!");
      res.sendStatus(200);
    } else {
      console.log("Unhealthy.");
      res.sendStatus(503);
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Microservice A is listening on port: ${port}`);
});


