import * as vendorController from '../app/controllers/vendorController';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({ vendors: {} })
})) as jest.Mock;

describe('vendorController', () => {
  it('getVendors returns array', async () => {
    const data = await vendorController.getVendors('token');
    expect(Array.isArray(data)).toBe(true);
  });
  it('reviewVendorApplication returns object', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })) as jest.Mock;
    const data = await vendorController.reviewVendorApplication(1, { status: 'approved' }, 'token');
    expect(typeof data).toBe('object');
  });
});
