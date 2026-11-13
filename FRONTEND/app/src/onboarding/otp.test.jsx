import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import OtpCustomer from './otp.jsx';

const navigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('OtpCustomer', () => {
  it('accepts numeric digits, moves focus, and rejects non-numeric input', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<OtpCustomer />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '4' } });

    expect(inputs[0].value).toBe('4');
    expect(document.activeElement).toBe(inputs[1]);

    fireEvent.change(inputs[1], { target: { value: 'x' } });
    expect(inputs[1].value).toBe('');
  });

  it('moves focus back on empty-field backspace and navigates after submission', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<OtpCustomer />);

    const inputs = screen.getAllByRole('textbox');
    inputs[1].focus();
    fireEvent.keyDown(inputs[1], { key: 'Backspace' });
    expect(document.activeElement).toBe(inputs[0]);

    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit OTP' }));

    expect(navigate).toHaveBeenCalledWith('/home');
    expect(inputs.every((input) => input.value === '')).toBe(true);
  });
});
