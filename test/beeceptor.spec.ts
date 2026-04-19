import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Beeceptor GET', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://cabff8afd5a65bc764e2.free.beeceptor.com';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('Should respond with status 200', async () => {
    await p.spec().get(baseUrl).expectStatus(StatusCodes.OK);
  });
});
