import {
  LoginReqBodySchema,
  TokenResponse,
  UserCreateReqBodySchema,
  UserResponse,
} from '@/api/iam/models/iam';
import { sleepAsync } from '@/lib/utils';
import { TEST_USER, TOKEN_RESPONSE } from '@/test/test_data';
import { http, HttpHandler, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const handlers: HttpHandler[] = [
  http.post('/iam/v1/login', async ({ request }) => {
    await sleepAsync(500);

    const loginReqBody = LoginReqBodySchema.parse(await request.json());
    if (
      loginReqBody.email !== TEST_USER.email ||
      loginReqBody.password !== TEST_USER.password
    ) {
      return HttpResponse.json(
        {
          message: 'invalid email and/or password',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json<TokenResponse>(TOKEN_RESPONSE, { status: 200 });
  }),

  http.post('/iam/v1/users', async ({ request }) => {
    console.log('create user endpoint is called');
    await sleepAsync(500);

    const userCreateReqBody = UserCreateReqBodySchema.parse(
      await request.json(),
    );

    // throw error if email's already used
    if (userCreateReqBody.email === TEST_USER.email) {
      return HttpResponse.json(
        {
          message: 'email is already used',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json<UserResponse>(
      {
        ...userCreateReqBody,
        id: 'newUser-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),
];

export const server = setupServer(...handlers);
