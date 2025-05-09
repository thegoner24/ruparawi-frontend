import * as addressController from '../app/controllers/addressController';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({ success: true })
})) as jest.Mock;

describe('addressController', () => {
  it('getUserAddresses returns data', async () => {
    const data = await addressController.getUserAddresses('token');
    expect(data).toBeDefined();
  });
  it('createUserAddress returns data', async () => {
    const data = await addressController.createUserAddress({ street: 'Jl. Test' }, 'token');
    expect(data).toBeDefined();
  });
  it('updateUserAddress returns data', async () => {
    const data = await addressController.updateUserAddress(1, { street: 'Jl. Update' }, 'token');
    expect(data).toBeDefined();
  });
  it('deleteUserAddress returns data', async () => {
    const data = await addressController.deleteUserAddress(1, 'token');
    expect(data).toBeDefined();
  });
});
