import { TestComponent } from '@/components/TestComponent';
import { TEST_USER } from '@/test/test_data';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import LoginPage from './page';

describe('Login Page', () => {
  it('should render login page', async () => {
    const user = userEvent.setup();

    render(
      TestComponent({
        withQueryClient: true,
        children: await LoginPage(),
      }),
    );

    // check title and description
    expect(screen.getAllByText('Kanban Flow')).toHaveLength(2);
    expect(screen.getByText('Organize your work with visual clarity'));
    expect(
      screen.getByText(
        'A kanban board designed for maximum readability and efficient task management. Track your projects from todo to completion with ease.',
      ),
    );

    // check all input fields
    const emailInput = screen.getByTestId<HTMLInputElement>('email-input');
    expect(emailInput.placeholder).toBe('Email');

    const passwordInput =
      screen.getByTestId<HTMLInputElement>('password-input');
    expect(passwordInput.placeholder).toBe('Password');

    // password input change type when the eye button is clicked
    expect(passwordInput).toHaveAttribute('type', 'password');
    const passwordVisibilityButton = screen.getByTestId<HTMLButtonElement>(
      'password-eye-button',
    );
    await user.click(passwordVisibilityButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    await user.click(passwordVisibilityButton);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const submitButton = screen.getByTestId<HTMLButtonElement>('login-submit');
    expect(submitButton.textContent).toBe('Sign in');
  });

  it('should success log in user', async () => {
    const user = userEvent.setup();

    render(
      TestComponent({
        withQueryClient: true,
        children: await LoginPage(),
      }),
    );

    expect(screen.getAllByText('Kanban Flow')).toHaveLength(2);

    const emailInput = screen.getByTestId<HTMLInputElement>('email-input');
    const passwordInput =
      screen.getByTestId<HTMLInputElement>('password-input');
    const submitButton = screen.getByTestId<HTMLButtonElement>('login-submit');

    await user.type(emailInput, TEST_USER.email);
    await user.type(passwordInput, TEST_USER.password);

    expect(emailInput).toHaveValue(TEST_USER.email);
    expect(passwordInput).toHaveValue(TEST_USER.password);
    expect(submitButton).toHaveTextContent('Sign in');

    await user.click(submitButton);

    expect(submitButton).toHaveTextContent('Signing in...');
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Sign in');
      expect(submitButton).not.toBeDisabled();
    });

    // TODO: add test for toast notification
  });

  it('should fail log in user', async () => {
    const user = userEvent.setup();

    render(
      TestComponent({
        withQueryClient: true,
        children: await LoginPage(),
      }),
    );

    expect(screen.getAllByText('Kanban Flow')).toHaveLength(2);

    const emailInput = screen.getByTestId<HTMLInputElement>('email-input');
    const passwordInput =
      screen.getByTestId<HTMLInputElement>('password-input');
    const submitButton = screen.getByTestId<HTMLButtonElement>('login-submit');

    expect(emailInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
    expect(submitButton).toHaveTextContent('Sign in');

    // user doesn't input anything
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText('Email must be in the correct format'),
      ).toBeDefined();
      expect(screen.queryByText('Password is required')).toBeDefined();
    });

    // user input email with incorrect format
    await user.type(emailInput, 'wrongemail');
    await user.click(submitButton);
    await waitFor(() => {
      expect(
        screen.queryByText('Email must be in the correct format'),
      ).toBeDefined();
      expect(screen.queryByText('Password is required')).toBeDefined();
    });

    // user input email with correct format
    await user.clear(emailInput);
    await user.type(emailInput, 'unregisteredEmail@example.com');
    await user.click(submitButton);
    await waitFor(() => {
      expect(
        screen.queryByText('Email must be in the correct format'),
      ).toBeNull();
      expect(screen.queryByText('Password is required')).toBeDefined();
    });

    // user input password
    await user.type(passwordInput, 'unregisteredPassword123');
    await user.click(submitButton);
    await waitFor(() => {
      expect(
        screen.queryByText('Email must be in the correct format'),
      ).toBeNull();
      expect(screen.queryByText('Password is required')).toBeNull();
    });

    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('invalid email and/or password'));
    });
  });
});
