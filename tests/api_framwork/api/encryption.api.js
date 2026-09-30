import { config } from '../config/config';

export async function encrypt(request) {

  const response = await request.post(
    `${config.baseURL}/api/Auth/Encrypt`,
    {
      headers: {
        'Content-Type': 'application/json'
      },

      data: {
        enc: "{'City':'Nagpur','CountryId':0,'StateId':0,'UserId':'33891','Pagesize':'200','Currentpage':'1'}",
        encKey: 'string'
      }
    }
  );

  console.log('Encrypt Status:', response.status());

  const encryption = await response.text();

  console.log('Encryption:', encryption);

  return encryption;
}