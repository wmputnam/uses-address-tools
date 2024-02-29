import { Address } from "../src/service/Address";
import { AddressBuilder } from "../src/service/AddressBuilder";
import { expect } from "chai";
import { extractStandardized, uspsAddressCheck } from '../src/service/UspsApiAddressCheck';
import { IAddressCheckStatus } from "../src/model/Address-Check-Result-interface";
import { resolve } from "path";


const fn = () => `${__filename.split('/').pop()}`;

describe(`${fn()}: USPS Address Check`, async function () {
  it(`should return a no-change status when supplied address validates with no change`, async function () {
    const testStreetAddress = "7222 KRAFT AVE";
    const testCity = "N HOLLYWOOD";
    const testState = "CA";
    const testZipCode = "91605";
    const testZipPlus4 = "3909";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withCity(testCity);
    builder.withState(testState);
    builder.withZIPCode(testZipCode);
    builder.withZIPPlus4(testZipPlus4);

    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress);
      expect(addressCheckResult).to.not.be.undefined;
      if (addressCheckResult) {
        expect(addressCheckResult.status).to.not.be.undefined;
        if (addressCheckResult.status) {
          expect(addressCheckResult.status).to.equal(IAddressCheckStatus.OKAY);
        }
        expect(addressCheckResult.addressResponse).to.not.be.undefined;
        if (addressCheckResult.addressResponse) {
          expect(addressCheckResult.addressResponse.streetAddress).to.equal(testStreetAddress);
          expect(addressCheckResult.addressResponse.city).to.equal(testCity);
          expect(addressCheckResult.addressResponse.state).to.equal(testState);
          expect(addressCheckResult.addressResponse.ZIPCode).to.equal(testZipCode);
          expect(addressCheckResult.addressResponse.ZIPPlus4).to.equal(testZipPlus4);
        }
      }
    }
    resolve();
  });

  it(`should return address object with 9 digit ZIP when supplied a valid address with a 5 digit ZIP`, async function () {
    const testStreetAddress = "7222 KRAFT AVENUE";
    const expectStreetAddress = "7222 KRAFT AVE";
    const testCity = "NORTH HOLLYWOOD";
    const expectCity = "N HOLLYWOOD";
    const testState = "CA";
    const testZipCode = "91605";
    const expectZipPlus4 = "3909";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withCity(testCity);
    builder.withState(testState);
    builder.withZIPCode(testZipCode);

    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress)
      expect(addressCheckResult).to.not.be.undefined;
      if (addressCheckResult) {
        expect(addressCheckResult.status).to.not.be.undefined;
        if (addressCheckResult.status) {
          expect(addressCheckResult.status).to.equal(IAddressCheckStatus.OKAY);
        }
        expect(addressCheckResult.addressResponse).to.not.be.undefined;
        if (addressCheckResult.addressResponse) {
          expect(addressCheckResult.addressResponse.streetAddress).to.equal(expectStreetAddress);
          expect(addressCheckResult.addressResponse.city).to.equal(expectCity);
          expect(addressCheckResult.addressResponse.state).to.equal(testState);
          expect(addressCheckResult.addressResponse.ZIPCode).to.equal(testZipCode);
          expect(addressCheckResult.addressResponse.ZIPPlus4).to.equal(expectZipPlus4);
        }
      }
    }
    resolve();
  });

  it(`should return address object with standardized street address when supplied a valid address with a 5 digit ZIP`, async function () {
    const testStreetAddress = "7222 KRAFT";
    const expectStreetAddress = "7222 KRAFT AVE";
    const expectCity = "N HOLLYWOOD";
    const testState = "CA";
    const testZipCode = "91605";
    const expectZipPlus4 = "3909";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withState(testState);
    builder.withZIPCode(testZipCode);

    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress)
      expect(addressCheckResult).to.not.be.undefined;
      if (addressCheckResult) {
        expect(addressCheckResult.status).to.not.be.undefined;
        if (addressCheckResult.status) {
          expect(addressCheckResult.status).to.equal(IAddressCheckStatus.OKAY);
        }
        expect(addressCheckResult.addressResponse).to.not.be.undefined;
        if (addressCheckResult.addressResponse) {
          expect(addressCheckResult.addressResponse.streetAddress).to.equal(expectStreetAddress);
          expect(addressCheckResult.addressResponse.city).to.equal(expectCity);
          expect(addressCheckResult.addressResponse.state).to.equal(testState);
          expect(addressCheckResult.addressResponse.ZIPCode).to.equal(testZipCode);
          expect(addressCheckResult.addressResponse.ZIPPlus4).to.equal(expectZipPlus4);
        }
      }
    }
    resolve();
  });

  it(`should return an invalid address status when supplied address is not valid`, async function () {
    const testStreetAddress = "17222 KRAFT";
    const testState = "CA";
    const testZipCode = "91605";
    const expectError = "address not found";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withState(testState);
    builder.withZIPCode(testZipCode);

    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress)
      expect(addressCheckResult).to.not.be.undefined;
      if (addressCheckResult) {
        expect(addressCheckResult.status).to.not.be.undefined;
        if (addressCheckResult.status) {
          expect(addressCheckResult.status).to.equal(IAddressCheckStatus.ERROR);
        }
        expect(addressCheckResult.addressResponse).to.be.undefined;
        expect(addressCheckResult.errorResponse).to.not.be.undefined;
        if (addressCheckResult.errorResponse) {
          expect(addressCheckResult.errorResponse.error).to.not.be.undefined;
          expect(addressCheckResult.errorResponse.error?.message).to.not.be.undefined;
          if (addressCheckResult.errorResponse.error && addressCheckResult.errorResponse.error.message) {
            const errorMsgLower = addressCheckResult.errorResponse.error.message.toLowerCase();
            expect(errorMsgLower).to.contain(expectError)
          }
        }
      }
    }
    resolve();
  });

  it(`should return an invalid address status when supplied address does not include a city or ZIPCode`, async function () {
    const testStreetAddress = "17222 KRAFT";
    const testState = "CA";
    const expectError = "invalid city";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withState(testState);

    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress)
      expect(addressCheckResult).to.not.be.undefined;
      if (addressCheckResult) {
        expect(addressCheckResult.status).to.not.be.undefined;
        if (addressCheckResult.status) {
          expect(addressCheckResult.status).to.equal(IAddressCheckStatus.ERROR);
        }
        expect(addressCheckResult.addressResponse).to.be.undefined;
        expect(addressCheckResult.errorResponse).to.not.be.undefined;
        if (addressCheckResult.errorResponse) {
          expect(addressCheckResult.errorResponse.error).to.not.be.undefined;
          expect(addressCheckResult.errorResponse.error?.message).to.not.be.undefined;
          if (addressCheckResult.errorResponse.error && addressCheckResult.errorResponse.error.message) {
            const errorMsgLower = addressCheckResult.errorResponse.error.message.toLowerCase();
            expect(errorMsgLower).to.contain(expectError)
          }
        }
      }
    }
    resolve();
  });

  it(`should return an invalid address status when supplied address does not include a street address`, async function () {
    const testState = "CA";
    const testZipCode = "91605";
    const expectErrorRequired = "parameter 'streetaddress' is required";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withState(testState);
    builder.withZIPCode(testZipCode);

    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress);
      expect(addressCheckResult).to.not.be.undefined;
      if (addressCheckResult) {
        expect(addressCheckResult.status).to.not.be.undefined;
        if (addressCheckResult.status) {
          expect(addressCheckResult.status).to.equal(IAddressCheckStatus.ERROR);
        }
        expect(addressCheckResult.addressResponse).to.be.undefined;
        expect(addressCheckResult.errorResponse).to.not.be.undefined;
        if (addressCheckResult.errorResponse) {
          expect(addressCheckResult.errorResponse.error).to.not.be.undefined;
          expect(addressCheckResult.errorResponse.error?.message).to.not.be.undefined;
          if (addressCheckResult.errorResponse.error && addressCheckResult.errorResponse.error.message) {
            const errorMsgLower = addressCheckResult.errorResponse.error.message.toLowerCase();
            expect(errorMsgLower).to.contain(expectErrorRequired)
          }
        }
      }
    }
    resolve();
  });

  it(`should return an invalid address status when supplied address does not include a state`, async function () {
    const testStreetAddress = "17222 KRAFT";
    const testZipCode = "91605";
    const expectErrorRequired = "parameter 'state' is required";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withZIPCode(testZipCode);

    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress);
      expect(addressCheckResult).to.not.be.undefined;
      if (addressCheckResult) {
        expect(addressCheckResult.status).to.not.be.undefined;
        if (addressCheckResult.status) {
          expect(addressCheckResult.status).to.equal(IAddressCheckStatus.ERROR);
        }
        expect(addressCheckResult.addressResponse).to.be.undefined;
        expect(addressCheckResult.errorResponse).to.not.be.undefined;
        if (addressCheckResult.errorResponse) {
          expect(addressCheckResult.errorResponse.error).to.not.be.undefined;
          expect(addressCheckResult.errorResponse.error?.message).to.not.be.undefined;
          if (addressCheckResult.errorResponse.error && addressCheckResult.errorResponse.error.message) {
            const errorMsgLower = addressCheckResult.errorResponse.error.message.toLowerCase();
            expect(errorMsgLower).to.contain(expectErrorRequired)
          }
        }
      }
    }
    resolve();
  });

  it(`should return an invalid address status when supplied address is missing secondary address`, async function () {
    const testStreetAddress = "2055 SACRAMENTO AVE";
    const testState = "CA";
    const testZipCode = "94109";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withState(testState);
    builder.withZIPCode(testZipCode);

    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress)
      expect(addressCheckResult).to.not.be.undefined;
      if (addressCheckResult) {
        expect(addressCheckResult.status).to.not.be.undefined;
        if (addressCheckResult.status) {
          expect(addressCheckResult.status).to.equal(IAddressCheckStatus.UNIT_MISSING);
        }
        expect(addressCheckResult.addressResponse).to.not.be.undefined;
        expect(addressCheckResult.errorResponse).to.be.undefined;
      }
    }
    resolve();
  });

  it(`should return an invalid address status when supplied address has invalid secondary address`, async function () {
    const testStreetAddress = "2055 SACRAMENTO AVE";
    const testSecondaryAddress = "APT 30060"
    const testState = "CA";
    const testZipCode = "94109";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withSecondaryAddress(testSecondaryAddress);
    builder.withState(testState);
    builder.withZIPCode(testZipCode);

    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress)
      expect(addressCheckResult).to.not.be.undefined;
      if (addressCheckResult) {
        expect(addressCheckResult.status).to.not.be.undefined;
        if (addressCheckResult.status) {
          expect(addressCheckResult.status).to.equal(IAddressCheckStatus.UNIT_NOT_VALID);
        }
        expect(addressCheckResult.addressResponse).to.not.be.undefined;
        expect(addressCheckResult.errorResponse).to.be.undefined;
      }
    }
    resolve();
  });
});

describe(`${fn()}: extract standardized address elements after USPS Address Check`, async function () {
  it(`should return an empty standardized address object when the returned address is exacly same as address parameters`, async function () {
    const testStreetAddress = "7222 KRAFT AVE";
    const testCity = "N HOLLYWOOD";
    const testState = "CA";
    const testZipCode = "91605";
    const testZipPlus4 = "3909";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withCity(testCity);
    builder.withState(testState);
    builder.withZIPCode(testZipCode);
    builder.withZIPPlus4(testZipPlus4);
    const testAddress: Address = builder.build() as Address;

    const builder2: AddressBuilder = new AddressBuilder();
    builder2.withStreetAddress(testStreetAddress);
    builder2.withCity(testCity);
    builder2.withState(testState);
    builder2.withZIPCode(testZipCode);
    builder2.withZIPPlus4(testZipPlus4);
    const testAddress2: Address = builder2.build() as Address;

    const stdizedAddr = extractStandardized(testAddress, testAddress2);
    expect(Object.keys(stdizedAddr).length).to.equal(0);
  });

  it(`should return a standardized address object with just street address when the returned address constains a difference in only the street address parameter`, async function () {
    const testStreetAddress = "7222 KRAFT AVENUE";
    const testStreetAddress2 = "7222 KRAFT AVE";
    const testCity = "N HOLLYWOOD";
    const testState = "CA";
    const testZipCode = "91605";
    const testZipPlus4 = "3909";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withCity(testCity);
    builder.withState(testState);
    builder.withZIPCode(testZipCode);
    builder.withZIPPlus4(testZipPlus4);
    const testAddress: Address = builder.build() as Address;

    const builder2: AddressBuilder = new AddressBuilder();
    builder2.withStreetAddress(testStreetAddress2);
    builder2.withCity(testCity);
    builder2.withState(testState);
    builder2.withZIPCode(testZipCode);
    builder2.withZIPPlus4(testZipPlus4);
    const testAddress2: Address = builder2.build() as Address;

    const stdizedAddr = extractStandardized(testAddress, testAddress2);
    const stdAddrKeys: string[] = Object.keys(stdizedAddr);
    expect(stdAddrKeys.length).to.equal(1);
    expect(stdAddrKeys).to.contain("streetAddress")
  });

  it(`should return a standardized address object with just secondary address when the returned address constains a difference in only the secondary address parameter`, async function () {
    const testStreetAddress = "7222 KRAFT AVENUE";
    const testSecondaryAddress1 = "#1";
    const testSecondaryAddress2 = "APT 1";
    const testCity = "N HOLLYWOOD";
    const testState = "CA";
    const testZipCode = "91605";
    const testZipPlus4 = "3909";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withSecondaryAddress(testSecondaryAddress1);
    builder.withCity(testCity);
    builder.withState(testState);
    builder.withZIPCode(testZipCode);
    builder.withZIPPlus4(testZipPlus4);
    const testAddress: Address = builder.build() as Address;

    const builder2: AddressBuilder = new AddressBuilder();
    builder2.withStreetAddress(testStreetAddress);
    builder2.withSecondaryAddress(testSecondaryAddress2);
    builder2.withCity(testCity);
    builder2.withState(testState);
    builder2.withZIPCode(testZipCode);
    builder2.withZIPPlus4(testZipPlus4);
    const testAddress2: Address = builder2.build() as Address;

    const stdizedAddr = extractStandardized(testAddress, testAddress2);
    const stdAddrKeys: string[] = Object.keys(stdizedAddr);
    expect(stdAddrKeys.length).to.equal(1);
    expect(stdAddrKeys).to.contain("secondaryAddress")
  });

  it(`should return a standardized address object with just city when the returned address constains a difference in only the city parameter`, async function () {
    const testStreetAddress = "7222 KRAFT AVENUE";
    const testCity1 = "NORTH HOLLYWOOD";
    const testCity2 = "N HOLLYWOOD";
    const testState = "CA";
    const testZipCode = "91605";
    const testZipPlus4 = "3909";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withCity(testCity1);
    builder.withState(testState);
    builder.withZIPCode(testZipCode);
    builder.withZIPPlus4(testZipPlus4);
    const testAddress: Address = builder.build() as Address;

    const builder2: AddressBuilder = new AddressBuilder();
    builder2.withStreetAddress(testStreetAddress);
    builder2.withCity(testCity2);
    builder2.withState(testState);
    builder2.withZIPCode(testZipCode);
    builder2.withZIPPlus4(testZipPlus4);
    const testAddress2: Address = builder2.build() as Address;

    const stdizedAddr = extractStandardized(testAddress, testAddress2);
    const stdAddrKeys: string[] = Object.keys(stdizedAddr);
    expect(stdAddrKeys.length).to.equal(1);
    expect(stdAddrKeys).to.contain("city")
  });

  it(`should return a standardized address object with just city when the returned address constains a city and the parameters did not`, async function () {
    const testStreetAddress = "7222 KRAFT AVENUE";
    const testCity = "N HOLLYWOOD";
    const testState = "CA";
    const testZipCode = "91605";
    const testZipPlus4 = "3909";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withState(testState);
    builder.withZIPCode(testZipCode);
    builder.withZIPPlus4(testZipPlus4);
    const testAddress: Address = builder.build() as Address;

    const builder2: AddressBuilder = new AddressBuilder();
    builder2.withStreetAddress(testStreetAddress);
    builder2.withCity(testCity);
    builder2.withState(testState);
    builder2.withZIPCode(testZipCode);
    builder2.withZIPPlus4(testZipPlus4);
    const testAddress2: Address = builder2.build() as Address;

    const stdizedAddr = extractStandardized(testAddress, testAddress2);
    const stdAddrKeys: string[] = Object.keys(stdizedAddr);
    expect(stdAddrKeys.length).to.equal(1);
    expect(stdAddrKeys).to.contain("city")
  });

  it(`should return a standardized address object with just state when the returned address constains a difference in only the state parameter`, async function () {
    const testStreetAddress = "7222 KRAFT AVENUE";
    const testCity = "N HOLLYWOOD";
    const testState1 = "AZ";
    const testState2 = "CA";
    const testZipCode = "91605";
    const testZipPlus4 = "3909";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withCity(testCity);
    builder.withState(testState1);
    builder.withZIPCode(testZipCode);
    builder.withZIPPlus4(testZipPlus4);
    const testAddress: Address = builder.build() as Address;

    const builder2: AddressBuilder = new AddressBuilder();
    builder2.withStreetAddress(testStreetAddress);
    builder2.withCity(testCity);
    builder2.withState(testState2);
    builder2.withZIPCode(testZipCode);
    builder2.withZIPPlus4(testZipPlus4);
    const testAddress2: Address = builder2.build() as Address;

    const stdizedAddr = extractStandardized(testAddress, testAddress2);
    const stdAddrKeys: string[] = Object.keys(stdizedAddr);
    expect(stdAddrKeys.length).to.equal(1);
    expect(stdAddrKeys).to.contain("state")
  });

  it(`should return a standardized address object with just ZIPCode when the returned address constains a difference in only the ZIPCode parameter`, async function () {
    const testStreetAddress = "7222 KRAFT AVENUE";
    const testCity = "N HOLLYWOOD";
    const testState = "CA";
    const testZipCode1 = "91601";
    const testZipCode2 = "91605";
    const testZipPlus4 = "3909";

    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withCity(testCity);
    builder.withState(testState);
    builder.withZIPCode(testZipCode1);
    const testAddress: Address = builder.build() as Address;

    const builder2: AddressBuilder = new AddressBuilder();
    builder2.withStreetAddress(testStreetAddress);
    builder2.withCity(testCity);
    builder2.withState(testState);
    builder2.withZIPCode(testZipCode2);
    builder2.withZIPPlus4(testZipPlus4);
    const testAddress2: Address = builder2.build() as Address;

    const stdizedAddr = extractStandardized(testAddress, testAddress2);
    const stdAddrKeys: string[] = Object.keys(stdizedAddr);
    expect(stdAddrKeys.length).to.equal(2);
    expect(stdAddrKeys).includes("ZIPCode")
    expect(stdAddrKeys).includes("ZIPPlus4")
  });

});