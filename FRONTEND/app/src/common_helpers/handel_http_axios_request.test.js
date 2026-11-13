import { afterEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import handleRequest from './handel_http_axios_request.js';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('handleRequest', () => {
  it('sends a GET request and handles a successful response', async () => {
    const response = { status: 200, data: { message: 'Saved' } };
    const showPopup = vi.fn();
    const navigateToHome = vi.fn();
    axios.get.mockResolvedValue(response);
    vi.stubGlobal('showPopup', showPopup);
    vi.stubGlobal('navigateToHome', navigateToHome);
    vi.spyOn(console, 'log').mockImplementation(() => {});

    await handleRequest('https://api.example.test', '/campaigns', 'GET');

    expect(axios.get).toHaveBeenCalledWith(
      'https://api.example.test/campaigns',
      undefined,
    );
    expect(showPopup).toHaveBeenCalledWith('Saved', 'green');
    expect(navigateToHome).toHaveBeenCalledOnce();
  });

  it('shows the server message for a bad-request response', async () => {
    const showPopup = vi.fn();
    const navigateToHome = vi.fn();
    axios.post.mockResolvedValue({
      status: 400,
      data: { message: 'Invalid campaign' },
    });
    vi.stubGlobal('showPopup', showPopup);
    vi.stubGlobal('navigateToHome', navigateToHome);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await handleRequest('https://api.example.test', '/campaigns', 'POST', {
      title: '',
    });

    expect(axios.post).toHaveBeenCalledWith(
      'https://api.example.test/campaigns',
      { title: '' },
    );
    expect(showPopup).toHaveBeenCalledWith('Invalid campaign', 'red');
    expect(navigateToHome).not.toHaveBeenCalled();
  });

  it('shows a generic message when the request rejects', async () => {
    const showPopup = vi.fn();
    axios.get.mockRejectedValue(new Error('Network unavailable'));
    vi.stubGlobal('showPopup', showPopup);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await handleRequest('https://api.example.test', '/campaigns', 'GET');

    expect(showPopup).toHaveBeenCalledWith('Request Failed', 'red');
  });
});
