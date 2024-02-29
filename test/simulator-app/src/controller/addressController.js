"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ALL_STATES = /AA|AE|AL|AK|AP|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MP|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY/;
class AddressController {
    static queryParams(req) {
        var _a, _b, _c, _d, _e, _f;
        const parseResult = { code: "200", parsedParams: {}, errors: [] };
        const streetAddress = (_a = req.query) === null || _a === void 0 ? void 0 : _a.streetAddress;
        if (streetAddress) {
            parseResult.parsedParams = Object.assign(Object.assign({}, parseResult.parsedParams), { streetAddress: streetAddress });
        }
        else {
            const err = [...parseResult.errors, { code: "r", detail: `missing required field 'streetAddress'` }];
            parseResult.parsedParams = Object.assign(Object.assign({}, parseResult.parsedParams), { streetAddress: "" });
            parseResult.code = "400";
            parseResult.errors = err;
        }
        const secondaryAddress = (_b = req.query) === null || _b === void 0 ? void 0 : _b.secondaryAddress;
        if (secondaryAddress) {
            parseResult.parsedParams = Object.assign(Object.assign({}, parseResult.parsedParams), { secondaryAddress: secondaryAddress });
        }
        const state = (_c = req.query) === null || _c === void 0 ? void 0 : _c.state;
        if (state) {
            const match = state.match(ALL_STATES);
            if ((match === null || match === void 0 ? void 0 : match[0]) === state) {
                parseResult.parsedParams = Object.assign(Object.assign({}, parseResult.parsedParams), { state: state });
            }
            else {
                const err = [...parseResult.errors, { code: "r", detail: `invalid value for field state:'${state}'` }];
                parseResult.parsedParams = Object.assign(Object.assign({}, parseResult.parsedParams), { state: "" });
                parseResult.code = "400";
                parseResult.errors = err;
            }
        }
        else {
            const err = [...parseResult.errors, { code: "r", detail: `missing required field 'state'` }];
            parseResult.parsedParams = Object.assign(Object.assign({}, parseResult.parsedParams), { state: "" });
            parseResult.code = "400";
            parseResult.errors = err;
        }
        const city = (_d = req.query) === null || _d === void 0 ? void 0 : _d.city;
        if (city) {
            parseResult.parsedParams = Object.assign(Object.assign({}, parseResult.parsedParams), { city: city });
        }
        const ZIPCode = (_e = req.query) === null || _e === void 0 ? void 0 : _e.ZIPCode;
        if (ZIPCode) {
            parseResult.parsedParams = Object.assign(Object.assign({}, parseResult.parsedParams), { ZIPCode: ZIPCode });
        }
        const ZIPPlus4 = (_f = req.query) === null || _f === void 0 ? void 0 : _f.ZIPPlus4;
        if (ZIPPlus4) {
            parseResult.parsedParams = Object.assign(Object.assign({}, parseResult.parsedParams), { ZIPPlus4: ZIPPlus4 });
        }
        if (streetAddress && state && !(city || ZIPCode)) {
            const err = [...parseResult.errors, { code: "r", detail: `Invalid City` }];
            parseResult.code = "400";
            parseResult.errors = err;
        }
        return parseResult;
    }
    getStandardizedAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const parseResult = AddressController.queryParams(req);
            // res.status(200).send(members);
            if (parseResult.code === "200") {
                res.status(200).send(AddressController.simSuccessResponse(parseResult.parsedParams));
            }
            else {
                res.status(parseInt(parseResult.code)).send({ error: { code: parseInt(parseResult.code), message: "parameter errors", errors: parseResult.errors } });
            }
        });
    }
    static simSuccessResponse(parsedParams) {
        return {
            firm: "",
            address: {
                streetAddress: parsedParams.streetAddress,
                streetAddressAbbreviation: "",
                secondaryAddress: parsedParams.secondaryAddress,
                cityAbbreviation: "",
                city: parsedParams.city,
                state: parsedParams.state,
                ZIPCode: parsedParams.ZIPCode,
                ZIPPlus4: parsedParams.ZIPPlus4,
                urbanization: ""
            },
            additionalInfo: {
                deliveryPoint: "",
                carrierRoute: "",
                DPVConfirmation: "",
                DPVCMRA: "",
                business: "",
                centralDeliveryPoint: "",
                vacant: ""
            },
            corrections: [],
            matches: []
        };
    }
}
exports.default = new AddressController();
