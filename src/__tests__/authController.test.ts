import { AuthController } from '../app/controllers/authController';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({ success: true, access_token: 'token' })
})) as jest.Mock;
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
    key: jest.fn((i) => Object.keys(store)[i] || null),
    get length() { return Object.keys(store).length; }
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

describe('AuthController', () => {
  it('register returns success', async () => {
    const result = await AuthController.register({ email: 'a@b.com', password: 'Abcd1234', firstName: 'A', lastName: 'B' });
    expect(result).toHaveProperty('success');
  });
  it('login returns success', async () => {
    const result = await AuthController.login({ email: 'a@b.com', password: 'Abcd1234' });
    expect(result).toHaveProperty('success');
  });
  it('logout removes authToken', () => {
    const removeItemSpy = jest.spyOn(global.localStorage, 'removeItem');
    AuthController.logout();
    expect(removeItemSpy).toHaveBeenCalledWith('authToken');
    removeItemSpy.mockRestore();
  });
  it('isAuthenticated returns boolean', () => {
    expect(typeof AuthController.isAuthenticated()).toBe('boolean');
  });
  it('getToken returns string or null', () => {
    expect([null, expect.any(String)]).toContain(AuthController.getToken());
  });
  it('getUserProfileWithRoles returns success', async () => {
    const result = await AuthController.getUserProfileWithRoles();
    expect(result).toHaveProperty('success');
  });
  it('getCurrentUser returns success', async () => {
    const result = await AuthController.getCurrentUser();
    expect(result).toHaveProperty('success');
  });
});
