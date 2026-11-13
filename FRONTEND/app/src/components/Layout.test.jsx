import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Layout from './Layout.jsx';

describe('Layout', () => {
  it('renders the page content with navigation and footer', () => {
    render(
      <Layout>
        <main>Campaign details</main>
      </Layout>,
    );

    expect(
      screen.getByRole('link', { name: 'Home (current)' }).getAttribute('href'),
    ).toBe('/home');
    expect(
      screen.getByRole('link', { name: 'My Profile' }).getAttribute('href'),
    ).toBe('/profile');
    expect(screen.getByRole('main').textContent).toContain('Campaign details');
    expect(
      screen.getByText('© 2024 Your Balance Humanity. All rights reserved.'),
    ).toBeTruthy();
  });
});
