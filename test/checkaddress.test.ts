import { Address } from "../src/service/Address";
import { AddressBuilder } from "../src/service/AddressBuilder";
import { expect } from "chai";
import { uspsAddressCheck } from '../src/usps-api-address-check';


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
    let status: number;
    let data: any;
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress)
      if (addressCheckResult) {
        status = addressCheckResult.status;
        data = addressCheckResult.data;
        expect(status).to.equal(200);
        expect(data.address.streetAddress).to.equal(testStreetAddress);
        expect(data.address.city).to.equal(testCity);
        expect(data.address.state).to.equal(testState);
        expect(data.address.ZIPCode).to.equal(testZipCode);
        expect(data.address.ZIPPlus4).to.equal(testZipPlus4);
      }
    }
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
    let status: number;
    let data: any;
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress)
      if (addressCheckResult) {
        status = addressCheckResult.status;
        data = addressCheckResult.data;
        expect(status).to.equal(200);
        expect(data.address.streetAddress).to.equal(expectStreetAddress);
        expect(data.address.city).to.equal(expectCity);
        expect(data.address.state).to.equal(testState);
        expect(data.address.ZIPCode).to.equal(testZipCode);
        expect(data.address.ZIPPlus4).to.equal(expectZipPlus4);
      }
    }
  });

  it(`should return address object with standardize street address when supplied a valid address with a 5 digit ZIP`, async function () {
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
    let status: number;
    let data: any;
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress)
      if (addressCheckResult) {
        status = addressCheckResult.status;
        data = addressCheckResult.data;
        expect(status).to.equal(200);
        expect(data.address.streetAddress).to.equal(expectStreetAddress);
        expect(data.address.city).to.equal(expectCity);
        expect(data.address.state).to.equal(testState);
        expect(data.address.ZIPCode).to.equal(testZipCode);
        expect(data.address.ZIPPlus4).to.equal(expectZipPlus4);
      }
    }
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
    let status: number;
    let error: string;
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress)
      if (addressCheckResult) {
        status = addressCheckResult.status;
        error = (addressCheckResult.data.error.message as string).toLowerCase();
        expect(status).to.be.oneOf([400, 404]);
        expect(error).to.contain(expectError);
      }
    }
  });

  it(`should return an invalid address status when supplied address does not include a city or ZIPCode`, async function () {
    const testStreetAddress = "17222 KRAFT";
    const testState = "CA";
    const expectError = "invalid city";
    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    builder.withState(testState);
    const testAddress: Address | undefined = builder.build();
    let status: number;
    let error: string;
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress)
      if (addressCheckResult) {
        status = addressCheckResult.status;
        error = (addressCheckResult.data.error.message as string).toLowerCase();
        expect(status).to.equal(400);
        expect(error).to.contain(expectError);
      }
    }
  });

  it(`should return an invalid address status when supplied address does not include a street address`, async function () {
    const testStreetAddress = "17222 KRAFT";
    const testState = "CA";
    const testZipCode = "91605";
    const expectErrorAddress = "streetaddress";
    const expectErrorRequired = "is required";
    const builder: AddressBuilder = new AddressBuilder();
    // builder.withStreetAddress(testStreetAddress);
    builder.withState(testState);
    builder.withZIPCode(testZipCode);
    const testAddress: Address | undefined = builder.build();
    let status: number;
    let error: string;
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress);

      if (addressCheckResult) {
        status = addressCheckResult.status;
        error = (addressCheckResult.data.error.message as string).toLowerCase();
        expect(status).to.equal(400);
        expect(error).to.include([expectErrorAddress]);
        expect(error).to.include([expectErrorRequired]);
      }
    }
  });

  it(`should return an invalid address status when supplied address does not include a state`, async function () {
    const testStreetAddress = "17222 KRAFT";
    const testState = "CA";
    const testZipCode = "91605";
    const expectErrorAddress = "state";
    const expectErrorRequired = "is required";
    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress(testStreetAddress);
    // builder.withState(testState);
    builder.withZIPCode(testZipCode);
    const testAddress: Address | undefined = builder.build();
    let status: number;
    let error: string;
    if (testAddress) {
      const addressCheckResult = await uspsAddressCheck(testAddress);

      if (addressCheckResult) {
        status = addressCheckResult.status;
        error = (addressCheckResult.data.error.message as string).toLowerCase();
        expect(status).to.equal(400);
        expect(error).to.include([expectErrorAddress]);
        expect(error).to.include([expectErrorRequired]);
      }
    }
  });

});