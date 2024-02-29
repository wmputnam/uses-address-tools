import { UspsApiOAuth30Service } from './UspsApiShippingOAuth3.0';
import { UspsApiAddressV30Service } from './UspsApiAddresses3.0';
import { IUspsAddressInterface } from "../model/USPS-Address-interface";
import { IAddressCheckResult, IAddressCheckStatus } from '../model/Address-Check-Result-interface';
import { IAddressRequestResponse } from '../model/USPS-Address-Request-Response-interface';
// import { IAddressResponse } from '../model/USPS-Address-response-interface';
import { IUspsErrorResponseInterface } from '../model/USPS-Error-Response-interface';
import { IAddressResponse } from '../model/USPS-Address-Response-interface';
const fn = () => `${__filename.split('/').pop()}`;
/**
 * 
 * @param params 
 * @returns 
 */
export async function uspsAddressCheck(params: IUspsAddressInterface): Promise<IAddressCheckResult> {
  // console.log(`${fn()} address to check: ${JSON.stringify(params)}`)
  let token: string;
  try {
    token = await UspsApiOAuth30Service.authenticate();
  } catch (error) {
    console.error(`uspsAddressCheck unable to authenticate`)
    throw new Error(`uspsAddressCheck unable to authenticate ${JSON.stringify(error)}`);
  }
  if (token) {
    let callResult: IAddressRequestResponse;
    try {
      // console.log(`got token: ${token}`)
      callResult = await UspsApiAddressV30Service.call(token, params);
      if (callResult.httpStatus === 200) {
        // console.log(`${fn()} result ${JSON.stringify(callResult)}`)
        return constructAddressCheckStatus(params, callResult);
      } else {
        // console.log(`${fn()} err result ${JSON.stringify(callResult)}`)
        return constructAddressCheckStatus(params, callResult);
      }

    } catch (error) {
      throw new Error(`unsuccessful call to address service ${error}`)
    }
    // console.log(`result ${JSON.stringify(result)}`)
  } else {
    // console.log(`uspsAddressCheck unable to authenticate`)
    throw new Error(`UspsApiOAuth30Service authenticate did not return OAuth3 token`);
  }
}

function constructAddressCheckStatus(params: IUspsAddressInterface, callResult: IAddressRequestResponse): IAddressCheckResult {
  let newStatus: IAddressCheckResult = {
    status: IAddressCheckStatus.CALL_MADE,
    addressToCheck: params,
    addressResponseStatus: callResult.httpStatus
  };

  // console.log(`input: ${JSON.stringify(input)}`)
  const httpStatus: number = callResult.httpStatus;
  // console.log(`httpStatus = ${httpStatus}`)
  let deliveryStatus: string = "";
  // console.log(`deliveryStatus = ${deliveryStatus}`)
  let checkStatus: IAddressCheckStatus = IAddressCheckStatus.VALID_PARAMS;
  let checkStatusMessage = "";
  let standardized: IUspsAddressInterface = {};

  if (httpStatus === 200) {
    const respAddress = (callResult.addressResponse as unknown as IAddressResponse);
    deliveryStatus = respAddress.additionalInfo.DPVConfirmation;
    // console.log(`deliveryStatus = ${deliveryStatus}`)
    switch (deliveryStatus) {
      case 'Y':
        checkStatus = IAddressCheckStatus.OKAY;
        checkStatusMessage = "";
        if (respAddress.address) {
          standardized = extractStandardized(params, respAddress.address);
        }
        break;
      case 'D':
        checkStatus = IAddressCheckStatus.UNIT_MISSING
        checkStatusMessage = "secondary address info is missing";
        standardized = {};
        break;
      default:
      case 'N':
        checkStatus = IAddressCheckStatus.NOT_DELIVERABLE
        checkStatusMessage = "not deliverable to the specified address or supplied secondary information may not be correct";
        standardized = {};
        break;
      case 'S':
        checkStatus = IAddressCheckStatus.UNIT_NOT_VALID
        checkStatusMessage = "not deliverable to the specified address or supplied secondary information may not be correct";
        standardized = {};
        break;
    }
    newStatus['status'] = checkStatus;
    newStatus['statusMessage'] = checkStatusMessage;
    newStatus['addressResponse'] = respAddress.address;
    newStatus['additionalInfoResponse'] = respAddress.additionalInfo;
    newStatus['addressDelta'] = standardized;
  } else {
    newStatus['status'] = IAddressCheckStatus.ERROR;
    const errResult = callResult.errorResponse as unknown as IUspsErrorResponseInterface;
    if (errResult) {
      newStatus['errorResponse'] = errResult;
      if (errResult.error && errResult.error.message) {
        newStatus['statusMessage'] = errResult.error.message;
      }

    }
  };
  return newStatus;
}


export function extractStandardized(params: IUspsAddressInterface, returned: IUspsAddressInterface): IUspsAddressInterface {

  let standardized: IUspsAddressInterface = {};

  // street address
  if (params.streetAddress && returned.streetAddress && params.streetAddress !== returned.streetAddress) {
    standardized['streetAddress'] = returned.streetAddress;
  }

  // secondary address / unit
  if (params.secondaryAddress) {
    if (returned.secondaryAddress && params.secondaryAddress !== returned.secondaryAddress) {
      standardized['secondaryAddress'] = returned.secondaryAddress;
    }
  } else {
    if (returned.secondaryAddress) {
      standardized['secondaryAddress'] = returned.secondaryAddress;
    }
  }

  // city
  if (params.city) {
    if (returned.city && params.city !== returned.city) {
      standardized['city'] = returned.city;
    }
  } else {
    if (returned.city) {
      standardized['city'] = returned.city;
    }
  }

  if (params.state) {
    if (returned.state && params.state !== returned.state) {
      standardized['state'] = returned.state;
    }
  } else {
    if (returned.state) {
      standardized['state'] = returned.state;
    }
  }

  if (params.ZIPCode) {
    if (returned.ZIPCode && params.ZIPCode !== returned.ZIPCode) {
      standardized['ZIPCode'] = returned.ZIPCode;
    }
  } else {
    if (returned.ZIPCode) {
      standardized['ZIPCode'] = returned.ZIPCode;
    }
  }

  if (params.ZIPPlus4) {
    if (returned.ZIPPlus4 && params.ZIPPlus4 !== returned.ZIPPlus4) {
      standardized['ZIPPlus4'] = returned.ZIPPlus4;
    }
  } else {
    if (returned.ZIPPlus4) {
      standardized['ZIPPlus4'] = returned.ZIPPlus4;
    }
  }

  return standardized;
}