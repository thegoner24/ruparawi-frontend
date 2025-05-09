import * as promotionController from '../app/controllers/promotionController';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({ promotions: [], success: true })
})) as jest.Mock;

describe('promotionController', () => {
  it('getPromotions returns array', async () => {
    const data = await promotionController.getPromotions('token');
    expect(Array.isArray(data)).toBe(true);
  });
  it('createPromotion returns object', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })) as jest.Mock;
    const data = await promotionController.createPromotion({ title: 'Promo', discount_value: 10 }, 'token');
    expect(typeof data).toBe('object');
  });
  it('updatePromotion returns object', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })) as jest.Mock;
    const data = await promotionController.updatePromotion(1, { title: 'Updated' }, 'token');
    expect(typeof data).toBe('object');
  });
  it('getPublicPromotions returns array', async () => {
    const data = await promotionController.getPublicPromotions();
    expect(Array.isArray(data)).toBe(true);
  });
  it('preCheckoutCalculation returns object', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })) as jest.Mock;
    const data = await promotionController.preCheckoutCalculation({});
    expect(typeof data).toBe('object');
  });
  it('getActivePromotionByCode returns object or null', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ promotions: [{ promo_code: 'PROMO', start_date: '2000-01-01', end_date: '2099-01-01' }] }) })) as jest.Mock;
    const data = await promotionController.getActivePromotionByCode('PROMO', 'token');
    expect([null, 'object']).toContain(typeof data === 'object' ? 'object' : data);
  });
});
