import z from 'zod';

export const TokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  status: z.string().default('success'),
});

export type TokenResponse = z.infer<typeof TokenResponseSchema>;

export const LoginReqBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginReqBody = z.infer<typeof LoginReqBodySchema>;

export const LoginFormSchema = z.object({
  email: z.email({ error: 'Email must be in the correct format' }),
  password: z.string().nonempty({ error: 'Password is required' }),
});

export type LoginForm = z.infer<typeof LoginFormSchema>;

export const UserResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;

export const UserCreateReqBodySchema = z.object({
  email: z.string(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

export type UserCreateReqBody = z.infer<typeof UserCreateReqBodySchema>;

export const UserCreateFormSchema = z
  .object({
    first_name: z.string().nonempty('First Name must not be empty'),
    last_name: z.string().nonempty('Last Name must not be empty'),
    email: z.email({ error: 'Email must be in the correct format' }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one digit')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character',
      ),
    retype_password: z.string().nonempty('Retype Password must not be empty'),
  })
  .superRefine(({ password, retype_password }, ctx) => {
    if (password !== retype_password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Retype Password does not match password',
        path: ['retype_password'],
      });
    }
  });

export type UserCreateForm = z.infer<typeof UserCreateFormSchema>;

export const LogoutResponseSchema = z.object({
  message: z.string(),
});

export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;
