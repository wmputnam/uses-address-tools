/**
 *
 */

import { IUspsAdditionalInfoInterface } from "./USPS-Additional-Info-interface";
import { IUspsAddressInterface } from "./USPS-Address-interface";
import { IUspsErrorResponseInterface } from "./USPS-Error-Response-interface";

export interface IAddressResponse {
  firm?:string;
  address?: IUspsAddressInterface;
  additionalInfo: IUspsAdditionalInfoInterface;
  corrections?: any[]; // any details to inform user about
  // addressResponse (data.address) contains the standardized address returned
  matches?: any[];
  // additionalInfoResponse.DPVConfirmation (data.additionalInfo.DPVConfirmation)
  additionalInfoResponse?: IUspsAdditionalInfoInterface;
  //    Y when deliverable as addressed
  //    D when secondary address info is missing and needed
  //    S supplied secondary information may not be correct
  //    N not deliverable to the specified address
  //
  // // errorResponse.message (data.error.message)
  // errorResponse: IUspsErrorResponseInterface;
  // //  address not found
  // //  data supplied has problem (missing city or ZIPCode or state or streetAddress)
  // addressDelta?: IUspsAddressInterface; // just the fields that differ between call and response when response address usable

  // standardized?: any; // just the fields that differ between call and response
  // data?: any; // data received back from call
}


