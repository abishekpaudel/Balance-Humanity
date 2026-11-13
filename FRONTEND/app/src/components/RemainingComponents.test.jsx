import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import CampaignForm from './CampaignForm.jsx';
import DonateForm from './DonateForm.jsx';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';
import Profile from './Profile.jsx';
import VerifyKyc from './VerifyKYC.jsx';
import WelcomePage from '../onboarding/welcome_page.jsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Navbar and Footer', () => {
  it('renders the main navigation destinations and logout action', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: 'BH' }).getAttribute('href')).toBe(
      '/home',
    );
    expect(
      screen.getByRole('link', { name: 'My Profile' }).getAttribute('href'),
    ).toBe('/profile');
    expect(
      screen.getByRole('link', { name: 'Start Campaign' }).getAttribute('href'),
    ).toBe('/start-campaign');
    expect(
      screen.getByRole('link', { name: 'Verify KYC' }).getAttribute('href'),
    ).toBe('/verify-kyc');
    expect(screen.getByRole('button', { name: 'Logout' })).toBeTruthy();
  });

  it('renders the copyright notice', () => {
    render(<Footer />);

    expect(
      screen.getByText('© 2024 Your Balance Humanity. All rights reserved.'),
    ).toBeTruthy();
  });
});

describe('Profile', () => {
  it('shows profile details and each campaign card', () => {
    render(<Profile />);

    expect(screen.getByText('Name: John Doe')).toBeTruthy();
    expect(screen.getByText('Description: This is bio')).toBeTruthy();
    expect(screen.getByText('Account No: 123567890')).toBeTruthy();
    expect(screen.getByText('Address: Lalitpur')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'My Campaigns' })).toBeTruthy();
    expect(screen.getByText('Test Campaign 1')).toBeTruthy();
    expect(screen.getByText('Test Campaign 2')).toBeTruthy();
  });
});

describe('Campaign and donation forms', () => {
  it('updates campaign fields as the user types', () => {
    render(<CampaignForm />);

    const title = document.querySelector('input[name="title"]');
    const description = document.querySelector('input[name="description"]');
    const account = document.querySelector('input[name="accNumber"]');

    fireEvent.change(title, { target: { value: 'Community garden' } });
    fireEvent.change(description, { target: { value: 'A shared green space' } });
    fireEvent.change(account, { target: { value: '1234567890' } });

    expect(title.value).toBe('Community garden');
    expect(description.value).toBe('A shared green space');
    expect(account.value).toBe('1234567890');
    expect(screen.getByRole('button', { name: 'Post' })).toBeTruthy();
  });

  it('updates donation account and amount fields', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<DonateForm />);

    const sender = document.querySelector('input[name="sendAccNumber"]');
    const recipient = document.querySelector('input[name="recAccNumber"]');
    const amount = document.querySelector('input[name="amount"]');

    fireEvent.change(sender, { target: { value: 'sender-1' } });
    fireEvent.change(recipient, { target: { value: 'recipient-2' } });
    fireEvent.change(amount, { target: { value: '250' } });

    expect(sender.value).toBe('sender-1');
    expect(recipient.value).toBe('recipient-2');
    expect(amount.value).toBe('250');
    expect(screen.getByRole('button', { name: 'Donate' })).toBeTruthy();
  });

  it('updates all KYC details', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<VerifyKyc />);

    const details = {
      fullname: 'Sam Example',
      accNumber: '9876543210',
      description: 'Community volunteer',
      citizenshipID: 'CIT-123',
      district: 'Lalitpur',
    };

    for (const [name, value] of Object.entries(details)) {
      fireEvent.change(document.querySelector(`input[name="${name}"]`), {
        target: { value },
      });
    }

    for (const [name, value] of Object.entries(details)) {
      expect(document.querySelector(`input[name="${name}"]`).value).toBe(value);
    }
    expect(screen.getByRole('button', { name: 'Verify' })).toBeTruthy();
  });
});

describe('WelcomePage', () => {
  it('renders the campaign cards and donate links', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<WelcomePage />);

    expect(screen.getByText(/We Are In A Mission To Help/)).toBeTruthy();
    expect(screen.getByText('Test Title 1')).toBeTruthy();
    expect(screen.getByText('Test Title 2')).toBeTruthy();
    expect(screen.getByText('Test Title 3')).toBeTruthy();
    expect(screen.getAllByRole('link', { name: 'Donate Now' })).toHaveLength(3);
    expect(screen.getAllByRole('heading', { name: 'Comments' })).toHaveLength(3);
  });
});
