import { CartController } from '../app/controllers/cartController';

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


describe('CartController', () => {
  it('getItems returns array', () => {
    expect(Array.isArray(CartController.getItems())).toBe(true);
  });
  it('addItem returns array', () => {
    expect(Array.isArray(CartController.addItem({ id: '1', name: 'Test', image: '', price: 10, quantity: 1 }, 1))).toBe(true);
  });
  it('updateQuantity returns array', () => {
    expect(Array.isArray(CartController.updateQuantity('1', 2))).toBe(true);
  });
  it('removeItem returns array', () => {
    expect(Array.isArray(CartController.removeItem('1'))).toBe(true);
  });
  it('clearCart calls removeItem', () => {
    const removeItemSpy = jest.spyOn(global.localStorage, 'removeItem');
    CartController.clearCart();
    expect(removeItemSpy).toHaveBeenCalledWith('cartItems');
    removeItemSpy.mockRestore();
  });
  it('getCartSummary returns object', () => {
    expect(typeof CartController.getCartSummary()).toBe('object');
  });
  it('applyPromoCode returns object', () => {
    expect(typeof CartController.applyPromoCode('WELCOME10')).toBe('object');
  });
});
