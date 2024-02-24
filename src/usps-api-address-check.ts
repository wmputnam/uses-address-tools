import { UspsApiOAuth30Service } from './service/UspsApiShippingOAuth3.0';
import { UspsApiAddressV30Service } from './service/UspsApiAddresses3.0';
import { UspsAddressInterface } from "./model/USPS-Address-interface";

/**
 * 
 */
export interface AddressCheckResult {
  status: string; // OK when address is usable by us  (200 + Y)
  // ERROR when we get a 4xx, ...
  // MISSING when we need secondary address (200 + D)
  // NOT_VALID (200 + S or N)
  statusMessage: string;  // any details to inform user about
  data: any;      // data received back from call
  // data.adderss contains the standardized address returned
  // data.addtionalInfo.DPVConfirmation
  //    Y when deliverable as addressed
  //    D when secondary address info is missing and needed
  //    S supplied secondary information may not be correct
  //    N not deliverable to the specified address
  // data.error.message
  //  address not found
  //  data supplied has problem (missing city or ZIPCode or state or streetAddress)

}

/**
 * 
 * @param params 
 * @returns 
 */
export async function uspsAddressCheck(params: UspsAddressInterface): AddressCheckResult {
  try {

    const token = await UspsApiOAuth30Service.authenticate();

    if (token) {
      const result = await UspsApiAddressV30Service.call(token, params);
      return { status: result.data.status, statusMessage: "", data: result.data } as AddressCheckResult;
      // console.log(`result ${JSON.stringify(result)}`)
    } else {
      console.log(`uspsAddressCheck unable to authenticate`)
      throw new Error(`uspsAddressCheck unable to authenticate`);
    }

    // });
  } catch (error) {
    throw new Error(`uspsAddressCheck unable to authenticate: ${error}`);
  }

  return { status: "500", statusMessage: "", data: {} } as AddressCheckResult;

}

