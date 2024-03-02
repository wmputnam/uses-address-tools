import { IUspsAddressInterface } from "../model/USPS-Address-interface";
import { ChangeAddress } from "../model/AddressChange";
import debug from "debug";
import { IAddressCheckResult, IAddressCheckStatus } from "../model/Address-Check-Result-interface";
import { IUspsAdditionalInfoInterface } from "../model/USPS-Additional-Info-interface";
import { IUspsError, IUspsErrorResponseInterface } from "../model/USPS-Error-Response-interface";
import { uspsAddressCheck } from "./UspsApiAddressCheck";

const fn = () => `${__filename.split('/').pop()}`;
const log: debug.IDebugger = debug(`${fn}`);

const MISSING_REQUIRED = `doCheck: missing parameter(s)-- address API not called`;
const MISSING_STREET = `doCheck: missing streetAddress parameter`;
const MISSING_STATE = `doCheck: missing state parameter`;
const MISSING_CITY = `doCheck: missing one of city or ZIPCode parameter`;
const AUTH_FAIL = `doCheck: caught authentication / authorization fail`;
const AUTH_TOKEN = `doCheck: caught authentication / authorization token missing`;
const CALL_FAIL = `doCheck: caught call error after authentication / authorization success`;
export class CheckedAddress implements IAddressCheckResult {
  addressToCheck?: IUspsAddressInterface | undefined;
  status: IAddressCheckStatus | undefined;
  statusMessage?: string | undefined;
  addressResponse?: IUspsAddressInterface | undefined;
  additionalInfoResponse?: IUspsAdditionalInfoInterface | undefined;
  errorResponse: IUspsErrorResponseInterface | undefined;
  addressDelta?: IUspsAddressInterface | undefined;
  // standardized?: any;
  // data?: any;

  constructor(addressToCheck: IUspsAddressInterface) {
    this.addressToCheck = addressToCheck;
    this.status = IAddressCheckStatus.NOT_CHECKED;
  }
  // streetAddress?: string;
  // secondaryAddress?: string;
  // city?: string;
  // state?: string;
  // urbanization?: string;
  // ZIPCode?: string;
  // ZIPPlus4?: string;

  static doCheck = async (addressToCheck: IUspsAddressInterface): Promise<CheckedAddress> => {
    let paramsValid = true;
    const ca: CheckedAddress = new CheckedAddress(addressToCheck);
    const err: IUspsErrorResponseInterface = { apiVersion: "NA", error: { code: "", message: "", errors: new Array<IUspsError>() } };

    // API requires:
    //   - streetAddress
    //   - state
    //   - one of:
    //     - city
    //     - ZIPCode
    // report out missing required data before attempting to get results from USPS API
    if (!addressToCheck.streetAddress || addressToCheck.streetAddress === "") {
      paramsValid = false;
      if (err && err.error) { err.error.message = MISSING_REQUIRED; }
      if (err && err.error && err.error.errors && typeof err.error.errors === 'object' && err.error.errors instanceof Array) {
        err.error.errors.push({ title: MISSING_STREET });
      }
    }

    if (!addressToCheck.state || addressToCheck.state === "") {
      paramsValid = false;
      if (err && err.error) { err.error.message = MISSING_REQUIRED; }
      if (err && err.error && err.error.errors && typeof err.error.errors === 'object' && err.error.errors instanceof Array) {
        err.error.errors.push({ title: MISSING_STATE });
      }
    }

    // console.log(`${fn()}: address.streetAddress: *${address.streetAddress}*`)
    if (paramsValid) {
      const hasCity = addressToCheck.city && addressToCheck.city !== "";
      const hasZIPCode = addressToCheck.ZIPCode && addressToCheck.ZIPCode !== "";
      if (!(hasCity || hasZIPCode)) {
        paramsValid = false;
        if (err && err.error) { err.error.message = MISSING_REQUIRED; }
        if (err && err.error && err.error.errors && typeof err.error.errors === 'object' && err.error.errors instanceof Array) {
          err.error.errors.push({ title: MISSING_CITY });
        }
      }
    }

    if (paramsValid) {
      ca.status = IAddressCheckStatus.VALID_PARAMS;
      try {
        let checkResult: IAddressCheckResult = await uspsAddressCheck(addressToCheck);
        ca.status = checkResult.status;
        if (ca.status === IAddressCheckStatus.OKAY) {
          ca.statusMessage = checkResult.statusMessage;
          ca.addressResponse = checkResult.addressResponse;
          ca.additionalInfoResponse = checkResult.additionalInfoResponse;
          ca.addressDelta = checkResult.addressDelta;
          // return ca;
        } else if (ca.status === IAddressCheckStatus.NOT_DELIVERABLE ||
          ca.status === IAddressCheckStatus.UNIT_MISSING ||
          ca.status === IAddressCheckStatus.UNIT_NOT_VALID) {
          ca.statusMessage = checkResult.statusMessage;
          ca.addressResponse = checkResult.addressResponse;
          ca.additionalInfoResponse = checkResult.additionalInfoResponse;
          // return ca;
        } else {
          ca.statusMessage = checkResult.statusMessage;
          if (checkResult.errorResponse) {
            ca.errorResponse = checkResult.errorResponse;
          }
        }
      } catch (error: any) {
        if (error.message.contains("unable to authenticate")) {
          ca.status = IAddressCheckStatus.AUTH_FAIL;
          if (err && err.error) { err.error.message = AUTH_FAIL; }
          if (err && err.error && err.error.errors && typeof err.error.errors === 'object' && err.error.errors instanceof Array) {
            err.error.errors.push({ title: error.message });
          }
          ca.errorResponse = err;
        } else if (error.message.contains("unsuccessful call to address service")) {
          ca.status = IAddressCheckStatus.CALL_FAIL;
          if (err && err.error) { err.error.message = CALL_FAIL; }
          if (err && err.error && err.error.errors && typeof err.error.errors === 'object' && err.error.errors instanceof Array) {
            err.error.errors.push({ title: error.message });
          }
          ca.errorResponse = err;
        } else if (error.message.contains("authenticate did not return OAuth3 token")) {
          ca.status = IAddressCheckStatus.AUTH_FAIL;
          if (err && err.error) { err.error.message = AUTH_TOKEN; }
          if (err && err.error && err.error.errors && typeof err.error.errors === 'object' && err.error.errors instanceof Array) {
            err.error.errors.push({ title: error.message });
          }
          ca.errorResponse = err;

        }
      }
    } else {
      ca.status = IAddressCheckStatus.INVALID_PARAMS;
      ca.errorResponse = err;
    }
    return ca;
  }
}
// toUspsAddressInterface(): IUspsAddressInterface {
//   const result = {} as IUspsAddressInterface;
//   if (this.streetAddress) {
//     result['streetAddress'] = this.streetAddress.toString();
//   }
//   if (this.secondaryAddress) {
//     result['secondaryAddress'] = this.secondaryAddress.toString();
//   }
//   if (this.city) {
//     result['city'] = this.city.toString();
//   }
//   if (this.state) {
//     result['state'] = this.state.toString();
//   }
//   if (this.urbanization) {
//     result['urbanization'] = this.urbanization.toString();
//   }
//   if (this.ZIPCode) {
//     result['ZIPCode'] = this.ZIPCode.toString();
//   }
//   if (this.ZIPPlus4) {
//     result['ZIPPlus4'] = this.ZIPPlus4.toString();
//   }
//   return result;
// }
// }
