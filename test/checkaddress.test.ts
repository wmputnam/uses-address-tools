import { Address } from "../src/service/Address";
import { AddressBuilder } from "../src/service/AddressBuilder";
import { expect } from "chai";

const fn = () => `${__filename.split('/').pop()}`;

describe(`${fn()}: USPS Address Check`, async function () {
  it(`should return a no-change status when supplied address validates with no change`, async function () {
    const builder: AddressBuilder = new AddressBuilder();
    builder.withStreetAddress("7222 KRAFT AVE");
    builder.withCity("N HOLLYWOOD");
    builder.withState("CA");
    builder.withZIP("91605-3909");
    const testAddress: Address | undefined = builder.build();
    if (testAddress) {
      const checkResults = await Address.checkAddress(testAddress.toUspsAddressInterface());
      expect(checkResults.status).to.be.equal('valid');
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