import { afterEach, describe, expect, it, vi } from 'vitest';
import showPopup from './pop_up_notification.js';

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
});

describe('showPopup', () => {
  it('displays the message with the requested color and removes it after three seconds', () => {
    vi.useFakeTimers();

    showPopup('Donation received', 'green');

    const popup = document.body.lastElementChild;
    expect(popup.tagName).toBe('DIV');
    expect(popup.innerText).toBe('Donation received');
    expect(popup.style.backgroundColor).toBe('green');
    expect(popup.style.color).toBe('white');
    expect(popup.style.position).toBe('fixed');

    vi.advanceTimersByTime(2999);
    expect(document.body.contains(popup)).toBe(true);

    vi.advanceTimersByTime(1);
    expect(document.body.contains(popup)).toBe(false);
  });
});
