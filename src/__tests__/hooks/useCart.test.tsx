import { renderHook, act } from '@testing-library/react';
import { useCart, CartItem } from '../../hooks/useCart';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useCart Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  const sampleItem: CartItem = {
    id: 'product-1',
    name: 'Test Product',
    price: 1000000,
    quantity: 1,
    image: 'test-image.jpg',
    size: 'M',
    color: 'Black',
  };

  it('should initialize with an empty cart', () => {
    const { result } = renderHook(() => useCart());
    
    expect(result.current.cart).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should add an item to the cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(sampleItem);
    });
    
    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0]).toEqual(sampleItem);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(1000000);
  });

  it('should increase quantity when adding the same item', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(sampleItem);
      result.current.addToCart(sampleItem);
    });
    
    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(2000000);
  });

  it('should add different items separately', () => {
    const { result } = renderHook(() => useCart());
    
    const secondItem: CartItem = {
      ...sampleItem,
      id: 'product-2',
      name: 'Second Product',
      price: 500000,
    };
    
    act(() => {
      result.current.addToCart(sampleItem);
      result.current.addToCart(secondItem);
    });
    
    expect(result.current.cart.length).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(1500000);
  });

  it('should remove an item from the cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(sampleItem);
    });
    
    expect(result.current.cart.length).toBe(1);
    
    act(() => {
      result.current.removeFromCart(sampleItem.id);
    });
    
    expect(result.current.cart.length).toBe(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(sampleItem);
    });
    
    expect(result.current.cart[0].quantity).toBe(1);
    
    act(() => {
      result.current.updateQuantity(sampleItem.id, 3);
    });
    
    expect(result.current.cart[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(3000000);
  });

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(sampleItem);
    });
    
    expect(result.current.cart.length).toBe(1);
    
    act(() => {
      result.current.updateQuantity(sampleItem.id, 0);
    });
    
    expect(result.current.cart.length).toBe(0);
  });

  it('should clear the entire cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(sampleItem);
      result.current.addToCart({
        ...sampleItem,
        id: 'product-2',
      });
    });
    
    expect(result.current.cart.length).toBe(2);
    
    act(() => {
      result.current.clearCart();
    });
    
    expect(result.current.cart.length).toBe(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should load cart from localStorage on initialization', () => {
    const savedCart = [sampleItem];
    mockLocalStorage.setItem('cart', JSON.stringify(savedCart));
    
    const { result } = renderHook(() => useCart());
    
    expect(result.current.cart).toEqual(savedCart);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('cart');
  });

  it('should save cart to localStorage when updated', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart(sampleItem);
    });
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([sampleItem]));
  });
});
