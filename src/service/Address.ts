import { IUspsAddressInterface } from "../model/USPS-Address-interface";
import { ChangeAddress } from "../model/AddressChange";
import debug from "debug";

const fn = () => `${__filename.split('/').pop()}`;
const log: debug.IDebugger = debug(`${fn}`);

const MISSING_REQUIRED = `MISSING REQUIRED`;
export class Address implements IUspsAddressInterface {
  streetAddress?: string;
  secondaryAddress?: string;
  city?: string;
  state?: string;
  urbanization?: string;
  ZIPCode?: string;
  ZIPPlus4?: string;

  // static checkAddress = async (address: IUspsAddressInterface): Promise<ChangeAddress> => {
  //   let localValid = true;
  //   const ca: ChangeAddress = { status: 'unknown', changes: { streetAddress: '', secondaryAddress: '', city: '', state: '', ZIPCode: '', ZIPPLus4: '' } };

  //   // report out missing required data before attempting to get results from USPS API
  //   if (!address.streetAddress || address.streetAddress === "") {
  //     localValid = false;
  //     ca.status = 'invalid';
  //     if (ca.changes !== undefined
  //       && typeof ca.changes === 'object') {
  //       ca.changes.streetAddress = MISSING_REQUIRED;
  //     }
  //   }

  //   // console.log(`${fn()}: address.streetAddress: *${address.streetAddress}*`)
  //   if (!address.city || address.city === "") {
  //     localValid = false;
  //     ca.status = 'invalid';
  //     if (ca.changes !== undefined
  //       && typeof ca.changes === 'object') {
  //       ca.changes.city = MISSING_REQUIRED;
  //     }
  //   }

  //   // console.log(`${fn()}: address.streetAddress: *${address.streetAddress}*`)
  //   if (!address.state || address.state === "") {
  //     localValid = false;
  //     ca.status = 'invalid';
  //     if (ca.changes !== undefined
  //       && typeof ca.changes === 'object') {
  //       ca.changes.state = MISSING_REQUIRED;
  //     }
  //   }

  //   if (localValid) {
  //     return await Address.remoteCheck(address, ca);
  //   } else {
  //     return ca;
  //   }

  // }

  toUspsAddressInterface(): IUspsAddressInterface {
    const result = {} as IUspsAddressInterface;
    if (this.streetAddress) {
      result['streetAddress'] = this.streetAddress.toString();
    }
    if (this.secondaryAddress) {
      result['secondaryAddress'] = this.secondaryAddress.toString();
    }
    if (this.city) {
      result['city'] = this.city.toString();
    }
    if (this.state) {
      result['state'] = this.state.toString();
    }
    if (this.urbanization) {
      result['urbanization'] = this.urbanization.toString();
    }
    if (this.ZIPCode) {
      result['ZIPCode'] = this.ZIPCode.toString();
    }
    if (this.ZIPPlus4) {
      result['ZIPPlus4'] = this.ZIPPlus4.toString();
    }
    return result;
  }
}
