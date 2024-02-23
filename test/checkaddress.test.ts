import { Address } from "../src/service/Address";
import { AddressBuilder } from "../src/service/AddressBuilder";
import { expect } from "chai";
import { uspsAddressCheck } from '../src/usps-api-address-check';
import { assert } from "console";


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
      const checkout = await uspsAddressCheck(testAddress)
      if (checkout) {
        // console.log(`checkout: ${JSON.stringify(checkout)}`);
        status = checkout.status;
        data = checkout.data;
        // console.log(`plus4: ${data.address.ZIPPlus4}`)
        expect(status).to.equal(200);
        expect(data.address.streetAddress).to.equal(testStreetAddress);
        expect(data.address.city).to.equal(testCity);
        expect(data.address.state).to.equal(testState);
        expect(data.address.ZIPCode).to.equal(testZipCode);
        expect(data.address.ZIPPlus4).to.equal(testZipPlus4);
      }
      // .catch((error) => {
      //   if (error.name === "AssertionError") {
      //     throw Error(error);
      //   } else {
      //     console.error(`error returned to 'USPS Address Check' ${JSON.stringify(error)}`)
      //   }
      // }
      // );
      // const checkResults = await Address.checkAddress(testAddress.toUspsAddressInterface());
    }
  });

  it.skip(`should return address change object with 9 digit ZIP when supplied a valid address with a 5 digit ZIP`, async function () {
    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress("7222 KRAFT AVE");
    builder.withCity("N HOLLYWOOD");
    builder.withState("CA");
    builder.withZIP("91605");
    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const checkResults = await Address.checkAddress(testAddress.toUspsAddressInterface());
      expect(checkResults.status).to.be.equal('change');
      expect(checkResults.changes?.ZIPPLus4).to.be.equal("3909")
    }
  });

  it.skip(`should return address change object with street address recommendated changes when supplied a valid address having non-standard address form (e.g., 7222 Kraft Avenue => 7222 KRAFT AV)`, async function () {
    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress("7222 KRAFT");
    builder.withCity("N HOLLYWOOD");
    builder.withState("CA");
    builder.withZIP("91605");
    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const checkResults = await Address.checkAddress(testAddress.toUspsAddressInterface());
      expect(checkResults.status).to.be.equal('change');
      expect(checkResults.changes?.streetAddress).to.be.equal("7222 KRAFT AVE")
    }

  });

  it.skip(`should return an invalid address status when supplied address is not valid`, async function () {
    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress("7218 KROFT");
    builder.withCity("LOS ANGELES");
    builder.withState("CA");
    builder.withZIP("90024");
    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const checkResults = await Address.checkAddress(testAddress.toUspsAddressInterface());
      expect(checkResults.status).to.be.equal('invalid');
    }
  });

  const MISSING_REQUIRED = "MISSING REQUIRED"
  it.skip(`should return an invalid address status when supplied address does not include a streetAddress`, async function () {
    const builder: AddressBuilder = new AddressBuilder();
    builder.withCity("N HOLLYWOOD");
    builder.withState("CA");
    builder.withZIP("91605");
    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const checkResults = await Address.checkAddress(testAddress.toUspsAddressInterface());
      expect(checkResults.status).to.be.equal('invalid');
      expect(checkResults.changes?.streetAddress).to.be.equal(MISSING_REQUIRED)
    }
  });

  it.skip(`should return an invalid address status when supplied address does not include a city`, async function () {
    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress("7222 KRAFT AVE");
    builder.withState("CA");
    builder.withZIP("91605");
    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const checkResults = await Address.checkAddress(testAddress.toUspsAddressInterface());
      expect(checkResults.status).to.be.equal('invalid');
      expect(checkResults.changes?.city).to.be.equal(MISSING_REQUIRED)
    }
  });

  it.skip(`should return an invalid address status when supplied address does not include a state`, async function () {
    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress("7222 KRAFT AVE");
    builder.withCity("N HOLLYWOOD");
    builder.withZIP("91605");
    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const checkResults = await Address.checkAddress(testAddress.toUspsAddressInterface());
      expect(checkResults.status).to.be.equal('invalid');
      expect(checkResults.changes?.state).to.be.equal(MISSING_REQUIRED)
    }
  });

});