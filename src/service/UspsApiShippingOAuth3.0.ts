import 'dotenv/config';

export class UspsApiOAuth30Service {
  static requestOptions: Partial<RequestInit> = {
    method: 'POST',
    redirect: 'follow'
  };

  static fn = () => `${__filename.split('/').pop()}`;

  static USPS_API_OAUTH_BASE: string = "https://api-cat.usps.com/oauth2/v3/token";


  static authenticate = async (): Promise<string> => {
    const consumer_id: string = process.env.USPS_SHIPPING_CLIENT_ID as string;

    const consumer_secret: string = process.env.USPS_SHIPPING_CLIENT_SECRET as string;

    const requestBody = {
      "client_id": consumer_id,
      "client_secret": consumer_secret,
      "grant_type": "client_credentials"
    };

    try {
      const response = await fetch(UspsApiOAuth30Service.USPS_API_OAUTH_BASE, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
      });
      const result: any = await response.json();
      return result['access_token'];
    } catch (error) {
      console.log(`UspsApiOAuth30Service error: ${JSON.stringify(error)}`);
      throw new Error(`UspsApiOAuth30Service error: ${error}`);
    }
  }
}