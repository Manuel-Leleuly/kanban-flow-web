import { UserCreateForm } from '@/api/iam/models/iam';
import { TestComponent } from '@/components/TestComponent';
import { TEST_USER } from '@/test/test_data';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import RegisterPage from './page';

describe('Register Page', () => {
  it('should render register page', async () => {
    const user = userEvent.setup();

    render(
      <TestComponent withQueryClient>
        <RegisterPage />
      </TestComponent>,
    );

    // check title and description
    expect(screen.getAllByText('Kanban Flow')).toHaveLength(2);
    expect(screen.getByText('Join thousands of productive teams'));
    expect(
      screen.getByText(
        'Start organizing your projects with our intuitive kanban board. Built for clarity, designed for productivity.',
      ),
    );

    // check all input fields
    expect(screen.getByTestId('first_name-input'));
    expect(screen.getByTestId('last_name-input'));
    expect(screen.getByTestId('email-input'));

    const password = screen.getByTestId('password-input');
    const retypePassword = screen.getByTestId('retype_password-input');

    // password input type change when the eye button is clicked
    expect(password).toHaveAttribute('type', 'password');
    const passwordVisibilityButton = screen.getByTestId('password-eye-button');
    await user.click(passwordVisibilityButton);
    expect(password).toHaveAttribute('type', 'text');
    await user.click(passwordVisibilityButton);
    expect(password).toHaveAttribute('type', 'password');

    // retype password input type change when the eye button is clicked
    expect(retypePassword).toHaveAttribute('type', 'password');
    const retypePassVisibilityButton = screen.getByTestId(
      'retype_password-eye-button',
    );
    await user.click(retypePassVisibilityButton);
    expect(retypePassword).toHaveAttribute('type', 'text');
    await user.click(retypePassVisibilityButton);
    expect(retypePassword).toHaveAttribute('type', 'password');

    expect(screen.getByTestId('register-submit')).toHaveTextContent(
      'Create account',
    );
  });

  it('should success register user', async () => {
    const user = userEvent.setup();

    const newUser: UserCreateForm = {
      first_name: 'New',
      last_name: 'User',
      email: 'newUser@example.com',
      password: 'newUser@123',
      retype_password: 'newUser@123',
    };

    render(
      <TestComponent withQueryClient>
        <RegisterPage />
      </TestComponent>,
    );

    expect(screen.getAllByText('Kanban Flow')).toHaveLength(2);
    expect(screen.getByText('Join thousands of productive teams'));
    expect(
      screen.getByText(
        'Start organizing your projects with our intuitive kanban board. Built for clarity, designed for productivity.',
      ),
    );

    const firstName = screen.getByTestId('first_name-input');
    const lastName = screen.getByTestId('last_name-input');
    const email = screen.getByTestId('email-input');
    const password = screen.getByTestId('password-input');
    const retypePasword = screen.getByTestId('retype_password-input');

    await user.type(firstName, newUser.first_name);
    await user.type(lastName, newUser.last_name);
    await user.type(email, newUser.email);
    await user.type(password, newUser.password);
    await user.type(retypePasword, newUser.retype_password);

    expect(firstName).toHaveValue(newUser.first_name);
    expect(lastName).toHaveValue(newUser.last_name);
    expect(email).toHaveValue(newUser.email);
    expect(password).toHaveValue(newUser.password);
    expect(retypePasword).toHaveValue(newUser.retype_password);

    const submitButton = screen.getByTestId('register-submit');
    expect(submitButton).toHaveTextContent('Create account');

    await user.click(submitButton);

    expect(submitButton).toHaveTextContent('Creating account...');
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Create account');
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should fail register user', async () => {
    const user = userEvent.setup();

    render(
      <TestComponent withQueryClient>
        <RegisterPage />
      </TestComponent>,
    );

    expect(screen.getAllByText('Kanban Flow')).toHaveLength(2);
    expect(screen.getByText('Join thousands of productive teams'));
    expect(
      screen.getByText(
        'Start organizing your projects with our intuitive kanban board. Built for clarity, designed for productivity.',
      ),
    );

    const firstName = screen.getByTestId('first_name-input');
    const lastName = screen.getByTestId('last_name-input');
    const email = screen.getByTestId('email-input');
    const password = screen.getByTestId('password-input');
    const retypePasword = screen.getByTestId('retype_password-input');

    const submitButton = screen.getByTestId('register-submit');
    expect(submitButton).toHaveTextContent('Create account');

    // click submit when the field is empty
    await user.click(submitButton);

    expect(screen.queryByText('First Name must not be empty')).toBeDefined();
    expect(screen.queryByText('Last Name must not be empty')).toBeDefined();
    expect(
      screen.queryByText('Email must be in the correct format'),
    ).toBeDefined();

    expect(
      screen.queryByText('Password must be at least 8 characters long'),
    ).toBeDefined();
    expect(
      screen.queryByText('Password must contain at least one uppercase'),
    ).toBeDefined();
    expect(
      screen.queryByText('Passwword must contain at least one lowercase'),
    ).toBeDefined();
    expect(
      screen.queryByText('Password must contain at least one digit'),
    ).toBeDefined();
    expect(
      screen.queryByText(
        'Password must contain at least one special character',
      ),
    ).toBeDefined();

    expect(
      screen.queryByText('Retype Password must not be empty'),
    ).toBeDefined();

    // user input first name
    await user.type(firstName, 'New');
    expect(screen.queryByText('First Name must not be empty')).toBeNull();

    // user input last name
    await user.type(lastName, 'User');
    expect(screen.queryByText('Last Name must not be empty')).toBeNull();

    // user input password that's too short
    await user.type(password, 'pwd');
    expect(
      screen.queryByText('Password must be at least 8 characters long'),
    ).toBeDefined();
    await user.clear(password);
    await user.type(password, 'longenough');
    expect(
      screen.queryByText('Password must be at least 8 characters long'),
    ).toBeNull();

    // user input password with at least one uppercase letter
    expect(
      screen.queryByText('Password must contain at least one uppercase'),
    ).toBeDefined();
    await user.clear(password);
    await user.type(password, 'Longenough');
    expect(
      screen.queryByText('Password must contain at least one uppercase'),
    ).toBeNull();

    // user input password with at least one lowercase letter
    expect(
      screen.queryByText('Password must contain at least one lowercase'),
    ).toBeNull();

    // user input password with at least one digit
    expect(
      screen.queryByText('Password must contain at least one digit'),
    ).toBeDefined();
    await user.clear(password);
    await user.type(password, 'Longenough123');
    expect(
      screen.queryByText('Password must contain at least one digit'),
    ).toBeNull();

    // user input password with at least one special character
    expect(
      screen.queryByText(
        'Password must contain at least one special character',
      ),
    ).toBeDefined();
    await user.clear(password);
    await user.type(password, 'Longenough@123');
    expect(
      screen.queryByText(
        'Password must contain at least one special character',
      ),
    ).toBeNull();

    // user input retype password that isn't the same as password
    await user.type(retypePasword, 'notthesame');
    expect(screen.queryByText('Retype Password must not be empty')).toBeNull();
    await user.click(submitButton);
    expect(
      screen.queryByText('Retype Password does not match password'),
    ).toBeDefined();
    await user.clear(retypePasword);
    await user.type(retypePasword, 'Longenough@123');
    expect(screen.queryByText('Retype Password must not be empty')).toBeNull();
    expect(
      screen.queryByText('Retype Password does not match password'),
    ).toBeNull();

    // user input email that's already been used
    await user.type(email, TEST_USER.email);
    expect(
      screen.queryByText('Email must be in the correct format'),
    ).toBeNull();

    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('email is already used'));
    });
  });
});
