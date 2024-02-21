import { convertXML } from "simple-xml-to-json";

const requestOptions: Partial<RequestInit> = {
  method: 'GET',
  redirect: 'follow'
};

const fn = () => `${__filename.split('/').pop()}`;

const SHIPPING_URL_DEFAULT = "https://api.usps.com/addresses/v1"; //"https://production.shippingapis.com/ShippingAPI.dll";

interface USPS_ADDRESS_VALIDATION_REQUEST {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip5?: string;
  zip4?: string;
}
const apiId = process.env.SHIPPING_API_ID;
const apiKey = process.env.SHIPPING_API_KEY;
const apiUrl = process.env.SHIPPING_API_URL ? process.env.SHIPPING_API_URL : SHIPPING_URL_DEFAULT;
const WebToolsAPI = "";//"Verify";

export async function requestAddressValidation({
  address1,
  address2 = "",
  city,
  state,
  zip5 = "",
  zip4 = ""
}: Partial<USPS_ADDRESS_VALIDATION_REQUEST>): Promise<any> {

  const requestUrl = `${apiUrl}?streetAddress=${address1}&secondaryAddress="${address2}"&city=${city}&state=${state}&ZIPcode=${zip5}&ZIPPlus4=${zip4}`;
  console.log(`${fn()}: requestUrl: ${requestUrl}`)
  fetch(requestUrl, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(`${fn()}: XMLresult: ${result}`);
      const rawJSON = repackageResponseAsJSON(result);
      console.log(`${fn()} rawJSON: ${JSON.stringify(rawJSON)}`);
      return rawJSON;
    })
    .catch(error => console.log(`${fn()}: error: ${error}`));
}

const repackageResponseAsJSON = (responseText: string): string => {
  let result: any = {};

  if (responseText !== "") {
    let rawJSON;
    try {
      rawJSON = convertXML(responseText);
      if (rawJSON.AddressValidateResponse && rawJSON.AddressValidateResponse.children && rawJSON.AddressValidateResponse.children[0] && rawJSON.AddressValidateResponse.children[0].Address && rawJSON.AddressValidateResponse.children[0].Address.children) {
        const addressJSONArr = rawJSON.AddressValidateResponse.children[0].Address.children;
        for (let i = 0; i < addressJSONArr.length; i++) {
          const addressElement = addressJSONArr[i];
          const addressElementKey = Object.keys(addressJSONArr[i])[0];
          console.log(`${fn()} addressElementKey: ${addressElementKey}`)
          result[addressElementKey] = addressElement[addressElementKey].content
        }

      }
    } catch (error) {
      throw Error(`${fn()}: convertXML returned error: ${error}`)
    }
  }
  return result;
}


