'use client';

import { UserCreateFormSchema } from '@/api/iam/models/iam';
import { FieldError } from '@/components/Input/FieldError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useRegisterFormLogic } from '@/logic/useRegisterFormLogic';
import { FetchUtil } from '@/utils/fetchUtils';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export const RegisterForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { registerForm, isLoading, error } = useRegisterFormLogic();

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
      className='space-y-4'
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await registerForm.handleSubmit();
      }}
    >
      <div className='grid grid-cols-2 gap-4'>
        <registerForm.Field
          name='first_name'
          validators={{ onChange: UserCreateFormSchema.shape.first_name }}
        >
          {(field) => (
            <div className='space-y-2'>
              <Label htmlFor={field.name} className='text-sm font-medium'>
                First name
              </Label>
              <Input
                type='text'
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder='John'
                className={cn(
                  'h-11 text-base',
                  !!field.state.meta.errors.length && 'border-destructive',
                )}
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
        </registerForm.Field>

        <registerForm.Field
          name='last_name'
          validators={{ onChange: UserCreateFormSchema.shape.last_name }}
        >
          {(field) => (
            <div className='space-y-2'>
              <Label htmlFor={field.name} className='text-sm font-medium'>
                Last name
              </Label>
              <Input
                type='text'
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder='Doe'
                className={cn(
                  'h-11 text-base',
                  !!field.state.meta.errors.length && 'border-destructive',
                )}
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
        </registerForm.Field>
      </div>

      <registerForm.Field
        name='email'
        validators={{ onChange: UserCreateFormSchema.shape.email }}
      >
        {(field) => (
          <div className='space-y-2'>
            <Label htmlFor={field.name} className='text-sm font-medium'>
              Email
            </Label>
            <Input
              type='email'
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder='johndoe@example.com'
              className={cn(
                'h-11 text-base',
                !!field.state.meta.errors.length && 'border-destructive',
              )}
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
      </registerForm.Field>

      <registerForm.Field
        name='password'
        validators={{ onChange: UserCreateFormSchema.shape.password }}
      >
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
                placeholder='Create a strong password'
                className={cn(
                  'h-11 text-base',
                  !!field.state.meta.errors.length && 'border-destructive',
                )}
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
      </registerForm.Field>

      <registerForm.Field
        name='retype_password'
        validators={{ onChange: UserCreateFormSchema.shape.retype_password }}
      >
        {(field) => (
          <div className='space-y-2'>
            <Label htmlFor={field.name} className='text-sm font-medium'>
              Re-type Password
            </Label>
            <div className='relative'>
              <Input
                type={isPasswordVisible ? 'text' : 'password'}
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder='Confirm your password'
                className={cn(
                  'h-11 text-base',
                  !!field.state.meta.errors.length && 'border-destructive',
                )}
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
      </registerForm.Field>

      <Button
        type='submit'
        className='w-full h-11 text-base font-medium'
        disabled={!registerForm.state.isFieldsValid || isLoading}
        data-testid='register-submit'
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
      <em className='text-red-500 text-sm'>{getErrorMessage()}</em>
    </form>
  );
};
