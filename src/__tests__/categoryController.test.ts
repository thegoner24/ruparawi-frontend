import * as categoryController from '../app/controllers/categoryController';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({ data: { categories: [] } })
})) as jest.Mock;

describe('categoryController', () => {
  it('getCategories returns array', async () => {
    const data = await categoryController.getCategories('token');
    expect(Array.isArray(data)).toBe(true);
  });
  it('getPublicCategories returns array', async () => {
    const data = await categoryController.getPublicCategories();
    expect(Array.isArray(data)).toBe(true);
  });
  it('createCategory returns object', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })) as jest.Mock;
    const data = await categoryController.createCategory({ name: 'Test', is_active: true }, 'token');
    expect(typeof data).toBe('object');
  });
  it('createSubcategory returns object', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })) as jest.Mock;
    const data = await categoryController.createSubcategory(1, { name: 'Sub', is_active: true }, 'token');
    expect(typeof data).toBe('object');
  });
  it('updateCategory returns object', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })) as jest.Mock;
    const data = await categoryController.updateCategory(1, { name: 'Updated' }, 'token');
    expect(typeof data).toBe('object');
  });
  it('deleteCategory returns object', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })) as jest.Mock;
    const data = await categoryController.deleteCategory(1, 'token');
    expect(typeof data).toBe('object');
  });
});
