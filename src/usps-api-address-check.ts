import { UspsApiOAuth30Service } from './service/UspsApiShippingOAuth3.0';
import { UspsApiAddressV30Service } from './service/UspsApiAddresses3.0';
import { UspsAddressInterface } from "./model/USPS-Address-interface";


export async function uspsAddressCheck(params: UspsAddressInterface) {
  try {

    const token = await UspsApiOAuth30Service.authenticate();

    if (token) {
      const result = await UspsApiAddressV30Service.call(token, params);
      return await result;
      // console.log(`result ${JSON.stringify(result)}`)
    } else {
      console.log(`uspsAddressCheck unable to authenticate`)
      throw new Error(`uspsAddressCheck unable to authenticate`);
    }

    // });
  } catch (error) {
    throw new Error(`uspsAddressCheck unable to authenticate: ${error}`);
  }



}