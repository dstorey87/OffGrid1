import { test, expect } from '@playwright/test';

test('homepage loads and shows header', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/OffGrid/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('core routes render without errors', async ({ page }) => {
  const routes = ['/', '/directory', '/calculators', '/chat'];
  for (const r of routes) {
    const response = await page.goto(r);
    expect(response?.status()).toBeLessThan(400);
    // Just verify the page loads - no visual regression
    await expect(page.locator('body')).toBeVisible();
  }
});

test('health endpoint returns healthy status', async ({ request }) => {
  const response = await request.get('http://localhost:3001/api/health');
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.status).toBe('healthy');
  expect(data.service).toBe('frontend');
});

test('WordPress API is accessible', async ({ request }) => {
  // WordPress can be slow to respond (10-15s), so increase timeout
  test.setTimeout(60000);
  const response = await request.get('http://localhost:8080/wp-json/', {
    timeout: 30000, // 30 second timeout for this specific request
  });
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.name).toBeDefined();
  expect(data.routes).toBeDefined();
});

test('AI service is accessible', async ({ request }) => {
  const response = await request.get('http://localhost:8001/health');
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.status).toBe('healthy');
  expect(data.service).toBe('ai-service');
});

test('AI service lists available models', async ({ request }) => {
  const response = await request.get('http://localhost:8001/api/v1/chat/models');
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).toHaveProperty('openai');
  expect(data).toHaveProperty('anthropic');
  expect(Array.isArray(data.openai)).toBe(true);
  expect(Array.isArray(data.anthropic)).toBe(true);
  expect(data.openai.length).toBeGreaterThan(0);
  expect(data.anthropic.length).toBeGreaterThan(0);
});

test('AI chat endpoint accepts requests and returns proper structure', async ({ request }) => {
  const response = await request.post('http://localhost:8001/api/v1/chat/', {
    data: {
      messages: [{ role: 'user', content: 'Hello, this is a test message' }],
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 100,
    },
  });

  // The request will fail without API keys, but we can validate the error structure
  // or accept a valid response structure if API keys are configured
  if (response.status() === 200) {
    const data = await response.json();
    // Validate response structure for successful responses
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('provider');
    expect(data).toHaveProperty('model');
    expect(data).toHaveProperty('usage');
    expect(typeof data.message).toBe('string');
    expect(typeof data.provider).toBe('string');
    expect(typeof data.model).toBe('string');
    expect(typeof data.usage).toBe('object');
  } else {
    // Without API keys, we expect either 400 (bad request/validation) or 500 (internal error)
    expect([400, 500]).toContain(response.status());
    const data = await response.json();
    expect(data).toHaveProperty('detail');
  }
});

test('AI chat endpoint validates request parameters', async ({ request }) => {
  // Test with invalid temperature (> 2.0)
  const response = await request.post('http://localhost:8001/api/v1/chat/', {
    data: {
      messages: [{ role: 'user', content: 'Test' }],
      temperature: 3.0, // Invalid
    },
  });
  expect(response.status()).toBe(422); // Validation error
});

test('AI chat endpoint requires messages field', async ({ request }) => {
  const response = await request.post('http://localhost:8001/api/v1/chat/', {
    data: {
      provider: 'openai',
      // Missing messages field
    },
  });
  expect(response.status()).toBe(422); // Validation error
});
