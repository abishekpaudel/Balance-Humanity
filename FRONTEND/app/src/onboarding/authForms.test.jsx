import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Login from './login.jsx';
import SignUp from './sign_up.jsx';
import showPopup from '../helpers/pop_up_notification.js';

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));

vi.mock('axios', () => ({
  default: { post: vi.fn() },
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
}));

vi.mock('../helpers/pop_up_notification', () => ({
  default: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('Login', () => {
  it('submits the entered credentials and navigates after a successful login', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { message: 'Welcome back' },
    });
    vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<Login />);
    fireEvent.change(document.querySelector('input[name="mobileNumber"]'), {
      target: { value: '9800000000' },
    });
    fireEvent.change(document.querySelector('input[name="password"]'), {
      target: { value: 'test-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:4900/api/v1/customer/login',
        { mobileNumber: '9800000000', password: 'test-password' },
      );
    });
    expect(showPopup).toHaveBeenCalledWith('Welcome back', 'green');
    expect(navigate).toHaveBeenCalledWith('home');
  });

  it('shows an error when the login request fails', async () => {
    axios.post.mockRejectedValue(new Error('Network unavailable'));
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(showPopup).toHaveBeenCalledWith('Login attemp Failed', 'red');
    });
    expect(navigate).not.toHaveBeenCalled();
  });
});

describe('SignUp', () => {
  it('submits registration details and navigates to OTP on success', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { message: 'Registration successful' },
    });
    vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<SignUp />);
    const formData = {
      firstName: 'Alex',
      lastName: 'Example',
      email: 'alex@example.com',
      mobileNumber: '9800000000',
      password: 'test-password',
      customerPin: '1234',
    };

    for (const [name, value] of Object.entries(formData)) {
      fireEvent.change(document.querySelector(`input[name="${name}"]`), {
        target: { value },
      });
    }

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:4900/api/v1/customer/register',
        formData,
      );
    });
    expect(showPopup).toHaveBeenCalledWith('Registration successful', 'green');
    expect(navigate).toHaveBeenCalledWith('/otp');
  });

  it('shows an error when registration fails', async () => {
    axios.post.mockRejectedValue(new Error('Network unavailable'));
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<SignUp />);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(showPopup).toHaveBeenCalledWith('Registration Failed', 'red');
    });
    expect(navigate).not.toHaveBeenCalled();
  });
});
