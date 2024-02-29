import 'dotenv/config';

class UspsApiOAuth30Data {
  token: string = "";
  expires: number = 0;

}
export class UspsApiOAuth30Service {
  static service: UspsApiOAuth30Data | undefined = undefined;


  static requestOptions: Partial<RequestInit> = {
    method: 'POST',
    redirect: 'follow'
  };


  static fn = () => `${__filename.split('/').pop()}`;

  static USPS_API_OAUTH_BASE: string = "https://api-cat.usps.com/oauth2/v3/token";


  static authenticate = async (): Promise<string> => {
    if (UspsApiOAuth30Service.service) {
      if (UspsApiOAuth30Service.service.token !== ""
        && UspsApiOAuth30Service.service.expires > Date.now()) {
        // console.log(`returing token3: ${UspsApiOAuth30Service.service.token}`)
        return UspsApiOAuth30Service.service.token;
      } else {
        var r: { token: string, expires: number } = await UspsApiOAuth30Service.requestToken();
        UspsApiOAuth30Service.service.token = r.token;
        UspsApiOAuth30Service.service.expires = r.expires;
        // console.log(`returing token: ${UspsApiOAuth30Service.service.token}`)
        return UspsApiOAuth30Service.service.token;
      }
    } else {
      var r: { token: string, expires: number } = await UspsApiOAuth30Service.requestToken();
      UspsApiOAuth30Service.service = new UspsApiOAuth30Data();
      UspsApiOAuth30Service.service.token = r.token;
      UspsApiOAuth30Service.service.expires = r.expires;
      // console.log(`returing token2: ${UspsApiOAuth30Service.service.token}`)
      return UspsApiOAuth30Service.service.token;
    }
  }

  static requestToken = async (): Promise<{ token: string, expires: number }> => {
    // console.log(`requesting token`)
    const consumer_id: string = process.env.USPS_SHIPPING_CLIENT_ID as string;

    const consumer_secret: string = process.env.USPS_SHIPPING_CLIENT_SECRET as string;

    const requestBody = {
      "client_id": consumer_id,
      "client_secret": consumer_secret,
      "grant_type": "client_credentials"
    };

    // console.log(`request: ${JSON.stringify(requestBody)}`)
    try {
      const response = await fetch(UspsApiOAuth30Service.USPS_API_OAUTH_BASE, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
      });
      const result: any = await response.json();
      // console.log(`result: ${JSON.stringify(result)}`)
      return {
        token: result['access_token'],
        expires: result['issued_at'] + result['expires_in']
      };
    } catch (error) {
      console.error(`UspsApiOAuth30Service error: ${JSON.stringify(error)}`);
      throw new Error(`UspsApiOAuth30Service error: ${error}`);
    }
  }

}