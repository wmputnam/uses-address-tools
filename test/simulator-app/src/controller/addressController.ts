import express from "express";
// import membersService from "../services/members.service";
// import debug from "debug";
// import { RestErrorBody } from "../common/interface/RestErrorBody";

// const log: debug.IDebugger = debug('sim:address-controller');


interface PARSED_PARAMS {
  streetAddress?: string;
  secondaryAddress?: string;
  city?: string;
  state?: string;
  urbanization?: string;
  ZIPCode?: string;
  ZIPPlus4?: string;
}
interface ERROR_SOURCE {
  parameter?: string;
  example?: string;
}
interface ERROR {
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: ERROR_SOURCE;
}
interface QUERY_PARSE_RESULT {
  code: string;
  message?: string;
  error?: string;
  errors: ERROR[];
  parsedParams: PARSED_PARAMS;
}

const ALL_STATES = /AA|AE|AL|AK|AP|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MP|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY/

class AddressController {

  static queryParams(req: express.Request): QUERY_PARSE_RESULT {
    const parseResult: QUERY_PARSE_RESULT = { code: "200", parsedParams: {}, errors: [] }
    const streetAddress: string = req.query?.streetAddress as string;
    if (streetAddress) {
      parseResult.parsedParams = { ...parseResult.parsedParams, streetAddress: streetAddress as string };
    } else {
      const err: ERROR[] = [...parseResult.errors, { code: "r", detail: `missing required field 'streetAddress'` }];
      parseResult.parsedParams = { ...parseResult.parsedParams, streetAddress: "" as string };
      parseResult.code = "400";
      parseResult.errors = err;
    }
    const secondaryAddress: string = req.query?.secondaryAddress as string;
    if (secondaryAddress) {
      parseResult.parsedParams = { ...parseResult.parsedParams, secondaryAddress: secondaryAddress as string };
    }
    const state: string = req.query?.state as string;
    if (state) {
      const match = state.match(ALL_STATES);
      if (match?.[0] === state) {
        parseResult.parsedParams = { ...parseResult.parsedParams, state: state as string };
      } else {
        const err: ERROR[] = [...parseResult.errors, { code: "r", detail: `invalid value for field state:'${state}'` }];
        parseResult.parsedParams = { ...parseResult.parsedParams, state: "" as string };
        parseResult.code = "400";
        parseResult.errors = err;
      }
    } else {
      const err: ERROR[] = [...parseResult.errors, { code: "r", detail: `missing required field 'state'` }];
      parseResult.parsedParams = { ...parseResult.parsedParams, state: "" as string };
      parseResult.code = "400";
      parseResult.errors = err;
    }
    const city: string = req.query?.city as string;
    if (city) {
      parseResult.parsedParams = { ...parseResult.parsedParams, city: city as string };
    }

    const ZIPCode: string = req.query?.ZIPCode as string;
    if (ZIPCode) {
      parseResult.parsedParams = { ...parseResult.parsedParams, ZIPCode: ZIPCode as string };
    }

    const ZIPPlus4: string = req.query?.ZIPPlus4 as string;
    if (ZIPPlus4) {
      parseResult.parsedParams = { ...parseResult.parsedParams, ZIPPlus4: ZIPPlus4 as string };
    }

    if (streetAddress && state && !(city || ZIPCode)) {
      const err: ERROR[] = [...parseResult.errors, { code: "r", detail: `Invalid City` }];
      parseResult.code = "400";
      parseResult.errors = err;
    }
    return parseResult;
  }

  async getStandardizedAddress(req: express.Request, res: express.Response) {
    const parseResult: QUERY_PARSE_RESULT = AddressController.queryParams(req);
    // res.status(200).send(members);
    if (parseResult.code === "200") {
      res.status(200).send(AddressController.simSuccessResponse(parseResult.parsedParams))
    } else {
      res.status(parseInt(parseResult.code)).send({ error: { code: parseInt(parseResult.code), message: "parameter errors", errors: parseResult.errors } })
    }
  }

  static simSuccessResponse(parsedParams: PARSED_PARAMS): Object {
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

export default new AddressController();