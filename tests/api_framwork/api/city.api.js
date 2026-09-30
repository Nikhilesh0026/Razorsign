import { config } from '../config/config';

export async function getCity(request, token, encryption) {

  const response = await request.post(
    `${config.baseURL}/api/CommonMasters/GetCity`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },

      data: encryption
    }
  );

  console.log('GetCity Status:', response.status());

  const cityResponse = await response.text();

  console.log('City Response:', cityResponse);

  return response;
}