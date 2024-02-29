import { IUspsAddressInterface } from "../model/USPS-Address-interface";
import { IAddressCheckResult } from '../model/Address-Check-Result-interface';
import { IAddressRequestResponse } from "../model/USPS-Address-Request-Response-interface";
// import { IAddressResponse } from "../model/USPS-Address-response-interface";
import { IUspsErrorResponseInterface } from "../model/USPS-Error-Response-interface";
import { IAddressResponse } from "../model/USPS-Address-Response-interface";

const USPS_API_CAT_BASE = "https://api-cat.usps.com";
const SIM_API_CAT_BASE = "https://localhost:3636/api/v1/sim";
const API_CAT_PATH = "/addresses/v3/address";

export class UspsApiAddressV30Service {

  static requestOptions: Partial<RequestInit> = {
    method: 'GET',
    redirect: 'follow'
  };

  static fn = () => `${__filename.split('/').pop()}`;


  static call = async (token: string, params: IUspsAddressInterface): Promise<IAddressRequestResponse> => {

    const authauth = `Bearer ${token}`;
    // console.log(`authauth: ${authauth}`);

    let myHeaders = new Headers();
    myHeaders.set("Content-Type", "application/json")
    // console.log(`\nmyHeaders: ${JSON.stringify(myHeaders.get("Content-Type"))}`);
    try {
      myHeaders.set("Authorization", authauth);
      // console.log(`\nmyHeaders: ${JSON.stringify(myHeaders.get("Authorization"))}`);
    } catch (err) {
      console.error(err);
    }
    // console.log(`\nmyHeaders: ${JSON.stringify(myHeaders)}`);
    // console.log(`\nmyHeaders: ${JSON.stringify(myHeaders)}`);

    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: myHeaders
    };

    const url: URL = new URL(API_CAT_PATH, USPS_API_CAT_BASE);


    if (params.streetAddress) {
      url.searchParams.append('streetAddress', params.streetAddress);
    }

    if (params.secondaryAddress) {
      url.searchParams.append('secondaryAddress', params.secondaryAddress);
    }

    if (params.city) {
      url.searchParams.append('city', params.city);
    }

    if (params.state) {
      url.searchParams.append('state', params.state);
    }

    if (params.ZIPCode) {
      url.searchParams.append('ZIPCode', params.ZIPCode);
    }
    if (params.ZIPPlus4) {
      url.searchParams.append('ZIPPlus4', params.ZIPPlus4);
    }

    // console.log(`url: ${url}`)
    // console.log(`options: ${JSON.stringify(requestOptions)}`)
    // TODO: add urbanization if we ever need it

    const myRequest = new Request(url);
    try {
      const response = await fetch(myRequest, requestOptions as RequestInit);
      const status: number = response.status;
      // console.log(`address status ${typeof status}`)
      // console.log(`address status ${status}`)
      const data = await response.json()
      // console.log(`address response ${JSON.stringify(await data)}`)
      if (status === 200) {
        return {
          httpStatus: status,
          addressResponse: {
            firm: data.firm,
            address: data.address,
            additionalInfo: data.additionalInfo,
            corrections: [],
            matches: []
          }
        } as IAddressRequestResponse;
      } else {
        return {
          httpStatus: status,
          errorResponse: {
            apiVersion: data.apiVersion,
            error: data.error
          }
        } as IAddressRequestResponse
      }
    } catch (error) {
      console.error(error);
      throw new Error(`${JSON.stringify(error)}`)
    }
  }
}