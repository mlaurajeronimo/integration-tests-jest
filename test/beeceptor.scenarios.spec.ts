import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Beeceptor - 10 scenarios (5 positive, 5 negative)', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://cabff8afd5a65bc764e2.free.beeceptor.com';

  
  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  // 5 Testes +
  it('Positive 1 - GET base returns 200', async () => {
    await p.spec().get(baseUrl).expectStatus(StatusCodes.OK);
  });

  it('Positive 2 - GET base body contains greeting', async () => {
    await p
      .spec()
      .get(baseUrl)
      .expectStatus(StatusCodes.OK)
      .expectBodyContains('Great to see you')
      .expectBodyContains('Hey ya');
  });

  it('Positive 3 - GET base has content-type text/plain header', async () => {
    await p
      .spec()
      .get(baseUrl)
      .expectStatus(StatusCodes.OK)
      .expectHeader('content-type', 'text/plain');
  });

  it('Positive 4 - POST to /test-post accepts JSON and returns 200', async () => {
    await p
      .spec()
      .post(`${baseUrl}/test-post`)
      .withJson({ name: 'pactum-test', value: 123 })
      .expectStatus(StatusCodes.OK)
      .expectBodyContains('Hey ya');
  });

  it('Positive 5 - PUT to /test-put returns 200 and responds quickly', async () => {
    await p
      .spec()
      .put(`${baseUrl}/test-put`)
      .withJson({ update: true })
      .expectStatus(StatusCodes.OK)
      .expectResponseTime(2000);
  });


  it('Negative 1 - DELETE to non-configured path returns default message (error-like)', async () => {
    await p
      .spec()
      .delete(`${baseUrl}/delete-non-config`)
      .expectStatus(StatusCodes.OK)
      .expectBodyContains('nothing is configured');
  });

  it('Negative 2 - GET to unknown path returns guidance to create rule', async () => {
    await p
      .spec()
      .get(`${baseUrl}/some-random-path-xyz`)
      .expectStatus(StatusCodes.OK)
      .expectBodyContains('Create a rule');
  });

  it('Negative 3 - POST with plain text returns default not-configured message', async () => {
    await p
      .spec()
      .post(`${baseUrl}/post-non-config`)
      .withHeaders('Content-Type', 'text/plain')
      .withBody('not a json')
      .expectStatus(StatusCodes.OK)
      .expectBodyContains('nothing is configured');
  });

  it('Negative 4 - PUT to unknown resource returns default message', async () => {
    await p
      .spec()
      .put(`${baseUrl}/put-non-config`)
      .withJson({ x: 'y' })
      .expectStatus(StatusCodes.OK)
      .expectBodyContains('nothing is configured');
  });

  it('Negative 5 - GET unknown path contains hint text (different substring)', async () => {
    await p
      .spec()
      .get(`${baseUrl}/another-missing`)
      .expectStatus(StatusCodes.OK)
      .expectBodyContains('mock API');
  });
});
