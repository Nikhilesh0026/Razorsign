import { test, expect } from '@playwright/test';

test('Login API', async ({ request }) => {
  const t0 = Date.now();

  const res = await request.post(
    'https://api.qaautomationlabs.com/v1/auth/login',
    {
      data: {
        email: 'qa@demo.io',
        password: 'Password123'
      }
    }
  );

 console.log('Status:', res.status());
  console.log('Body:', await res.json());
  console.log('Response Time:', Date.now() -t0 , 'ms');

  expect(res.status()).toBe(200);
});
