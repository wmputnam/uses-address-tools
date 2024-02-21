import { Address } from "./Address";

export class AddressBuilder {
  address: Address;

  constructor() {
    this.address = new Address();
  }

  reset() {
    this.address = new Address();
  }


  withStreetAddress = (streetAddress: string): AddressBuilder | undefined => {

    this.address.streetAddress = streetAddress;
    return this;

  }

  withSecondaryAddress = (secondaryAddress: string): AddressBuilder | undefined => {
    this.address.secondaryAddress = secondaryAddress;
    return this;
  }

  withCity = (city: string): AddressBuilder | undefined => {
    this.address.city = city;
    return this;
  }

  withState = (state: string): AddressBuilder | undefined => {
    this.address.state = state;
    return this;
  }

  withZIP = (ZIP: string): AddressBuilder | undefined => {
    switch (ZIP.length) {
      case 5:
        this.address.ZIPCode = ZIP;
        this.address.ZIPPlus4 = "ZIP";
        break;
      case 9:
        this.address.ZIPCode = ZIP.substring(0, 5);
        this.address.ZIPPlus4 = ZIP.substring(5);
        break;
      case 10:
        if (ZIP.indexOf('-') === 5) {
          this.address.ZIPCode = ZIP.substring(0, 5);
          this.address.ZIPPlus4 = ZIP.substring(6);
        } else {
          throw Error(`ZIP with length 10 must have "-" between ZIPCode and ZIPPlus4`)
        }
        break;
      default:
        throw Error(`ZIP must be either 5 digits or 9 digits`)
    }
    return this;
  }

  withUrbanization = (urbanization: string): AddressBuilder | undefined => {
    this.address.urbanization = urbanization;
    return this;
  }

  build = (): Address | undefined => {
    return this.address;
  }
}
