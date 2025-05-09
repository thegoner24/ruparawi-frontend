import * as wishlistController from '../app/controllers/wishlistController';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({ success: true })
})) as jest.Mock;

describe('wishlistController', () => {
  it('getWishlist returns data', async () => {
    const data = await wishlistController.getWishlist('token');
    expect(data).toBeDefined();
  });
  it('addToWishlist returns data', async () => {
    const data = await wishlistController.addToWishlist(1, 'token');
    expect(data).toBeDefined();
  });
  it('removeFromWishlist returns data', async () => {
    const data = await wishlistController.removeFromWishlist(1, 'token');
    expect(data).toBeDefined();
  });
});
