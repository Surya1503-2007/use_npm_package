/**
 * sample-app.js — A sample Express app file
 *
 * This file imports some of the project's dependencies to simulate
 * a real-world app. repo-audit will scan this file to determine
 * which dependencies are actually used in the codebase.
 */

import express from "express";
import axios from "axios";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello from the demo app!", status: "ok" });
});

app.get("/fetch", async (req, res) => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Note: 'lodash' and 'moment' are listed as dependencies in package.json
// but are NOT imported here — repo-audit will flag them as unused!

export default app;
