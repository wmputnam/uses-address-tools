"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const addressController_1 = __importDefault(require("./controller/addressController"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3636;
app.get('/', (req, res) => {
    res.status(404).send({ error: { message: 'Express + TypeScript Server!! (nodemon)' } });
});
app.get('/api/v1/sim', (req, res) => {
    res.status(404).send({ error: { message: 'USPS Simulation' } });
});
app.get('/api/v1/sim/address', (req, res) => {
    // res.status(400).send({ apiVersion: "SIM Address 3.0", error: { message: `Error in received request: 'streetAddress' and 'state' are required parameters` } });
    addressController_1.default.getStandardizedAddress(req, res);
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
