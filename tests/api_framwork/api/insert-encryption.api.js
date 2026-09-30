import { config } from '../config/config.js';

export async function insertEncryption(request) {

  const response = await request.post(
    `${config.baseURL}/api/Auth/Encrypt`,
    {
      headers: {
        'Content-Type': 'application/json'
      },

      data: {
        enc: "{'City':'Nagpur_New','CountryId':26,'StateId':201,'UserId':'33891','STDcode':'12345','IsDefault':'1','IPAddress':'192.168.168.4'}",
        encKey: 'string'
      }
    }
  );

  console.log('Insert Encryption Status:', response.status());

  const encryption = await response.text();

  console.log('Insert Encryption:', encryption);

  return encryption;
}
