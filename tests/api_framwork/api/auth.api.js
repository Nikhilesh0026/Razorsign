import { config } from '../config/config.js';

export async function getToken(request) {
  const response = await request.post(
    `${config.baseURL}/api/Auth/GetToken`,
    {
      params: {
        LoginId: config.loginId,
        UserId: config.userId
      }
    }
  );

  console.log('GetToken Status:', response.status());

  const token = await response.text();

  console.log('Token:', token);

  return token;
}
