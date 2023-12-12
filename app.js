var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const { default: axios } = require("axios");
var app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const API_KEY = "d16691a35725edbd67f5193f34f27d8173d7786e";
const PORT = 4000;

const validateApiKey = (req, res, next) => {
  const api_key = req.headers.key;
  if (!api_key || api_key !== API_KEY) {
    return res.status(401).json({ message: "API Key is missing or invalid" });
  }
  next();
};

app.post("/calculations", validateApiKey, async function (req, res, next) {
  try {
    const response = await axios.post(
      `http://127.0.0.1:5001/christopher-lanternfinance/us-central1/calculateResult/calculations`,
      { ...req.body },
      { headers: { authorization: req.headers.authorization } }
    );
    res.json(response.data);
  } catch (error) {
    if (!error.response) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(error.response.status).json(error.response.data);
  }
});

app.post("/conversions", validateApiKey, async function (req, res, next) {
  try {
    const response = await axios.post(
      `http://127.0.0.1:5001/christopher-lanternfinance/us-central1/calculateResult/conversions`,
      { ...req.body },
      { headers: { authorization: req.headers.authorization } }
    );
    res.json(response.data);
  } catch (error) {
    if (!error.response) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(error.response.status).json(error.response.data);
  }
});

app.get(
  "/:collection(Calculations|Conversions)",
  validateApiKey,
  async function (req, res, next) {
    try {
      let collectionName = req.params.collection;
      collectionName =
        collectionName.charAt(0).toUpperCase() + collectionName.slice(1);
      const response = await axios.get(
        `http://127.0.0.1:5001/christopher-lanternfinance/us-central1/getHistory/${collectionName}`,
        { headers: { authorization: req.headers.authorization } }
      );
      res.json(response.data);
    } catch (error) {
      if (!error.response) {
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(error.response.status).json(error.response.data);
    }
  }
);
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
module.exports = app;
