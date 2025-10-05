'use client';

import { FieldError } from '@/components/Input/FieldError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginFormLogic } from '@/logic/useLoginFormLogic';
import { FetchUtil } from '@/utils/fetchUtils';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export const LoginForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { loginForm, isLoading, error } = useLoginFormLogic();

  const getErrorMessage = () => {
    if (error) {
      const errorData = FetchUtil.parseServerActionError(error);
      const { response_data } = errorData;
      if (response_data) {
        if (typeof response_data === 'string') {
          return response_data;
        }
        return response_data.message;
      }
    }
    return '';
  };

  return (
    <form
      className='space-y-8'
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await loginForm.handleSubmit();
      }}
    >
      <loginForm.Field name='email'>
        {(field) => (
          <div className='space-y-2'>
            <Label htmlFor={field.name} className='text-sm font-medium'>
              Email address
            </Label>
            <Input
              type='email'
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder='Email'
              className='w-full'
              disabled={isLoading}
              data-testid={field.name + '-input'}
            />
            <FieldError
              errorMessages={field.state.meta.errors.map(
                (error) => error?.message,
              )}
            />
          </div>
        )}
      </loginForm.Field>

      <loginForm.Field name='password'>
        {(field) => (
          <div className='space-y-2'>
            <Label htmlFor={field.name} className='text-sm font-medium'>
              Password
            </Label>
            <div className='relative'>
              <Input
                type={isPasswordVisible ? 'text' : 'password'}
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder='Password'
                className='w-full'
                disabled={isLoading}
                data-testid={field.name + '-input'}
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                onClick={() => setIsPasswordVisible((prevState) => !prevState)}
                disabled={isLoading}
                data-testid={field.name + '-eye-button'}
              >
                {isPasswordVisible ? (
                  <EyeOff className='h-4 w-4 text-muted-foreground' />
                ) : (
                  <Eye className='h-4 w-4 text-muted-foreground' />
                )}
              </Button>
            </div>
            <FieldError
              errorMessages={field.state.meta.errors.map(
                (error) => error?.message,
              )}
            />
          </div>
        )}
      </loginForm.Field>

      <Button
        type='submit'
        className='w-full h-11 text-base font-medium'
        disabled={!loginForm.state.isFieldsValid || isLoading}
        data-testid='login-submit'
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
      <em className='text-red-500 text-sm'>{getErrorMessage()}</em>
    </form>
  );
};
