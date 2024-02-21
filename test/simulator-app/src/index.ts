import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import addressController from "./controller/addressController";

dotenv.config();

const app = express();
const port = process.env.PORT || 3636;

app.get('/', (req, res) => {
  res.status(404).send({ error: { message: 'Express + TypeScript Server!! (nodemon)' } });
});

app.get('/api/v1/sim', (req, res) => {
  res.status(404).send({ error: { message: 'USPS Simulation' } });
});

app.get('/api/v1/sim/address', (req, res) => {
  // res.status(400).send({ apiVersion: "SIM Address 3.0", error: { message: `Error in received request: 'streetAddress' and 'state' are required parameters` } });
  addressController.getStandardizedAddress(req,res);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});