/**
 *
 */

import { IUspsAdditionalInfoInterface } from "./USPS-Additional-Info-interface";
import { IUspsAddressInterface } from "./USPS-Address-interface";
import { IUspsErrorResponseInterface } from "./USPS-Error-Response-interface";

export enum IAddressCheckStatus {
  NOT_CHECKED = "NOT_CHECKED",        // result object is not yet represent checked address -- html status, data.additionalInfo.DPVConfirmation
  VALID_PARAMS = "VALID_PARAMS",      // address to check is ok -- not checked yet
  INVALID_PARAMS = "INVALID_PARAMS", // address to check not ok -- see errorResponse
  AUTH_FAIL = "AUTH_FAIL",          // address to check is ok, authorization failure -- -- see errorResponse
  CALL_FAIL = "CALL_FAIL",          // address to check is ok & authed, call failure -- -- see errorResponse
  CALL_MADE = "CALL_MADE",          // check result needs to be processed into IAddressCheckStatus
  //                                //                                                       html status, data.additionalInfo.DPVConfirmation
  ERROR = "ERROR",                  // html status is 4xx, or 5xx -- see errorResponse       [45]xx        NA
  OKAY = "OKAY",                          // address is usable                                     200          'Y'
  NOT_DELIVERABLE = "NOT_DELIVERABLE",// street address is not u                               200          'N'
  UNIT_MISSING = "UNIT_MISSING",      // address not usable without secondary address          200          'D'
  UNIT_NOT_VALID = "UNIT_NOT_VALID",  // address not usable with given secondary address       200          'S' 
};

export interface IAddressCheckResult {
  addressToCheck?: IUspsAddressInterface;
  status?: IAddressCheckStatus;
  statusMessage?: string; // any details to inform user about
  // addressResponse (data.address) contains the standardized address returned
  addressResponseStatus?: number;
  addressResponse?: IUspsAddressInterface;
  // additionalInfoResponse.DPVConfirmation (data.additionalInfo.DPVConfirmation)
  additionalInfoResponse?: IUspsAdditionalInfoInterface;
  //    Y when deliverable as addressed
  //    D when secondary address info is missing and needed
  //    S supplied secondary information may not be correct
  //    N not deliverable to the specified address
  //
  // errorResponse.message (data.error.message)
  errorResponse?: IUspsErrorResponseInterface;
  //  address not found
  //  data supplied has problem (missing city or ZIPCode or state or streetAddress)
  addressDelta?: IUspsAddressInterface; // just the fields that differ between call and response when response address usable

  // standardized?: any; // just the fields that differ between call and response
  // data?: any; // data received back from call
}

