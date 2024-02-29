/**
 *
 */

import { IAddressResponse } from "./USPS-Address-Response-interface";
import { IUspsErrorResponseInterface } from "./USPS-Error-Response-interface";

export interface IAddressRequestResponse {
  httpStatus: number;
  addressResponse?: IAddressResponse;
  errorResponse?: IUspsErrorResponseInterface;
}


