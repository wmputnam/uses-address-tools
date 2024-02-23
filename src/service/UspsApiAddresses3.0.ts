import { UspsAddressInterface } from "../model/USPS-Address-interface";

const USPS_API_CAT_BASE = "https://api-cat.usps.com";
const SIM_API_CAT_BASE = "https://localhost:3636/api/v1/sim";
const API_CAT_PATH = "/addresses/v3/address";

export class UspsApiAddressV30Service {

  static requestOptions: Partial<RequestInit> = {
    method: 'GET',
    redirect: 'follow'
  };

  static fn = () => `${__filename.split('/').pop()}`;


  static call = async (token: string, params: UspsAddressInterface): Promise<any> => {

    const myHeaders = new Headers();
    const authauth = `Bearer ${token}`;

    myHeaders.append("Authorization", `${authauth}`);
    myHeaders.append("Content-Type", "application/json")

    const requestOptions = {
      method: "GET",
      headers: myHeaders
    };

    const url: URL = new URL(API_CAT_PATH, USPS_API_CAT_BASE);
    // console.log(`url: ${url}`)

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

    // TODO: add urbanization if we ever need it

    try {
      const response = await fetch(url,
        requestOptions);
      const status = response.status;
      const data = await response.json()
      return { status: status, data: data };
    } catch (error) {
      console.error(error);

    }
    // fetch("https://api-cat.usps.com/addresses/v3/address?streetAddress=3120%20M%20St&city=Washington&state=DC&ZIPCode=20027&ZIPPlus4=3704",
    //   requestOptions)
    //   .then((response) => response.json())
    //   .then((result) => { console.log(JSON.stringify(result)); return result; })
    //   .catch((error) => console.error(error));




    // const consumer_id: string = process.env.USPS_SHIPPING_CLIENT_ID as string;

    // const consumer_secret: string = process.env.USPS_SHIPPING_CLIENT_SECRET as string;

    // console.log(`${JSON.stringify(process.env.TERM_PROGRAM)}`);

    // const requestBody = {
    //   "client_id": consumer_id,
    //   "client_secret": consumer_secret,
    //   "grant_type": "client_credentials"
    // };

    // // console.log(`${JSON.stringify(requestBody)}`);
    // fetch(UspsApiAddressV30Service.SIM_API_CAT_BASE, {
    //   method: 'GET',
    //   body: JSON.stringify(requestBody),
    //   headers: { 'Content-Type': 'application/json' }
    // })
    //   .then(response => response.json())
    //   .then(result => {
    //     // console.log(`${UspsApiOAuth30Service.fn()}:  ${JSON.stringify(result)}`);
    //     // const rawJSON = repackageResponseAsJSON(result);
    //     // console.log(`${fn()} rawJSON: ${JSON.stringify(rawJSON)}`);
    //     return result['access_token'];
    //   })
    //   .catch(error => console.log(`${UspsApiAddressV30Service.fn()}: error: ${error}`));
    // return {};
  }


}