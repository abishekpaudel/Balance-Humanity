import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import CommentSection from './CommentSection.jsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CommentSection', () => {
  it('shows the signed-in user and adds a submitted comment', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <CommentSection
        postId="post-1"
        email="person@example.com"
        image="/profile.png"
      />,
    );

    const textarea = screen.getByPlaceholderText('Type your comment...');
    expect(
      screen.getByAltText('person@example.com').getAttribute('src'),
    ).toBe('/profile.png');

    fireEvent.change(textarea, { target: { value: 'A helpful comment' } });
    fireEvent.click(screen.getByRole('button', { name: 'Comment' }));

    expect(screen.getByText('A helpful comment')).toBeTruthy();
    expect(textarea.value).toBe('');
  });

  it('does not add an empty or whitespace-only comment', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<CommentSection postId="post-1" email="person@example.com" />);

    const textarea = screen.getByPlaceholderText('Type your comment...');
    fireEvent.change(textarea, { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Comment' }));

    expect(document.querySelectorAll('.comment-text')).toHaveLength(0);
    expect(textarea.value).toBe('   ');
  });

  it('clears the comment draft when the clear icon is clicked', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<CommentSection postId="post-1" email="person@example.com" />);

    const textarea = screen.getByPlaceholderText('Type your comment...');
    fireEvent.change(textarea, { target: { value: 'Draft comment' } });
    fireEvent.click(document.querySelector('.clear-comment svg'));

    expect(textarea.value).toBe('');
  });
});
