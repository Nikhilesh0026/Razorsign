import { test, expect } from '@playwright/test';

import { getToken } from '../api/auth.api.js';
import { encrypt } from '../api/encryption.api.js';
import { getCity } from '../api/city.api.js';
import { insertEncryption } from '../api/insert-encryption.api.js';
import { insertCity } from '../api/insert-city.api.js';

test.describe('CLD City API Chaining @smokeapi', () => {

  test('Get Token → Encrypt → Get City', async ({ request }) => {

    // 1. Get Token
    const token = await getToken(request);

    expect(token).toBeTruthy();

    // 2. Encrypt
    const encryption = await encrypt(request);

    expect(encryption).toBeTruthy();

    // 3. Get City using token + encryption
    const response = await getCity(
      request,
      token,
      encryption
    );

    expect(response.status()).toBe(200);
  });

  test('Insert City API Chain', async ({ request }) => {

  // 1. Get Token
  const token = await getToken(request);

  // 2. Encrypt Insert City data
  const encryption = await insertEncryption(request);

  // 3. Insert City using token + encryption
  const response = await insertCity(
    request,
    token,
    encryption
  );

  console.log('Final Status:', response.status());

  expect(response.status()).toBe(200);
});

});