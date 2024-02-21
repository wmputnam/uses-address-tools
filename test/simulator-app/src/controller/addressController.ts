import express from "express";
// import membersService from "../services/members.service";
import debug from "debug";
// import { RestErrorBody } from "../common/interface/RestErrorBody";

const log: debug.IDebugger = debug('sim:address-controller');


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
      if (state.length === 2) {
        //^(AA|AE|AL|AK|AP|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MP|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY)$
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
    const city : string = req.query?.city as string;
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
      res.status(200).send(parseResult.parsedParams)
    } else {
      res.status(parseInt(parseResult.code)).send({ error: { code: parseInt(parseResult.code), message: "parameter errors", errors: parseResult.errors } })
    }
  }

  // async listMembersV1(req: express.Request, res: express.Response) {
  //   const { limit, page, sort, filter } = MembersController.listQueryParams(req, { isActive: true })
  //   // jscpd:ignore-start
  //   const count = await membersService.countV1(filter);

  //   const members = await membersService.listV1(limit, page, sort, filter);

  //   res.status(200).send({ data: members, page: page, limit: limit, count: count });
  //   // jscpd:ignore-end
  // }

  // async listNewMembersV1(req: express.Request, res: express.Response) {
  //   const { limit, page, sort, filter } = MembersController.listQueryParams(req, { isActive: true, isNewMember: true });

  //   // jscpd:ignore-start
  //   const count = await membersService.countV1(filter);

  //   const members = await membersService.listV1(limit, page, sort, filter);

  //   res.status(200).send({ data: members, page: page, limit: limit, count: count });
  //   // jscpd:ignore-end
  // }

  // async getMemberById(req: express.Request, res: express.Response) {

  //   const member = await membersService.getMemberById(req.body.id);

  //   if (member !== null) {
  //     res.status(200).send(member);
  //   } else {
  //     res.status(404).send({ error: [`Member with id ${req.body.id} not found`] });
  //   }
  // }

  // async createMember(req: express.Request, res: express.Response) {
  //   let memberId;
  //   try {
  //     memberId = await membersService.create(req.body);
  //   } catch (error) {
  //     const errBody: RestErrorBody = { error: [`${error}`] };

  //     res.status(400).send(errBody)
  //     return;
  //   }
  //   res.status(200).send({ id: memberId });
  // }

  // async patch(req: express.Request, res: express.Response) {
  //   log(await membersService.patchById(req.body.id, req.body));
  //   res.status(204).send();
  // }

  // async put(req: express.Request, res: express.Response) {
  //   log(`put body ${JSON.stringify(req.body)}`)
  //   log(await membersService.putById(req.body.id, req.body));
  //   res.status(204).send();
  // };

  // async removeMember(req: express.Request, res: express.Response) {
  //   log(await membersService.deleteById(req.body.id));
  //   res.status(204).send();
  // }

  // async patchStatus(req: express.Request, res: express.Response) {
  //   log(await membersService.patchById(req.body.id, req.body));
  //   res.status(204).send();
  // }

  // static createSortObject = (sortQueryParam: string) => {
  //   const termArr: string[] = [];
  //   if (sortQueryParam && typeof sortQueryParam === 'string') {

  //     const items = sortQueryParam.split(",");

  //     for (let i = 0; i < items.length; i++) {
  //       const spec = items[i].split(":")

  //       if (spec[1] && ["asc", "ASC", "1"].includes(spec[1])) {
  //         termArr.push(spec[0])
  //       } else {
  //         termArr.push("-".concat(spec[0]));
  //       }
  //     }
  //   }
  //   return termArr.join(" ");
  // }

  // static createFilterObject = (filterQueryParam: string) => {
  //   const termMap: Map<string, Object> = new Map<string, Object>();

  //   if (filterQueryParam && typeof filterQueryParam === 'string') {
  //     const items = filterQueryParam.split(",");

  //     let pattern;
  //     for (let i = 0; i < items.length; i++) {
  //       if (items[i].indexOf(':') >= 0) {
  //         const spec = items[i].split(":")
  //         if (spec[1].charAt(0) === '/') {
  //           const regexStr: string = spec[1].replaceAll(/\//g, '');
  //           pattern = { $regex: regexStr }
  //         } else {
  //           pattern = spec[1]
  //         }

  //         termMap.set(spec[0], pattern)
  //       } else {

  //       }
  //     }
  //   }
  //   let filterObj = Object.fromEntries(termMap);
  //   return filterObj;
  // }
}

export default new AddressController();