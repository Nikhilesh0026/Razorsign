import { config } from '../config/config.js';

export async function insertCity(request, token, encryption) {

  const response = await request.post(
    `${config.baseURL}/api/CommonMasters/InsertCity`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },

      data: encryption
    }
  );

  console.log('Insert City Status:', response.status());

  const result = await response.text();

  console.log('Insert City Response:', result);

  return response;
}
