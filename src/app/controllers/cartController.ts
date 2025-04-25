// Cart Controller
// This controller centralizes all cart-related logic

// Define types for cart
export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}

// Cart controller class
export class CartController {
  // Get all cart items
  static getItems(): CartItem[] {
    try {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        return JSON.parse(storedCart);
      }
      return [];
    } catch (error) {
      console.error('Error retrieving cart items:', error);
      return [];
    }
  }
  
  // Add item to cart
  static addItem(product: any, quantity: number = 1, size: string = "M", color: string = "Black"): CartItem[] {
    try {
      const currentCart = this.getItems();
      
      // Check if item already exists in cart
      const existingItemIndex = currentCart.findIndex(item => 
        item.id === product.id && item.size === size && item.color === color
      );
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        updatedItems = [...currentCart];
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if it doesn't exist
        updatedItems = [...currentCart, {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: quantity,
          size: size,
          color: color
        }];
      }
      
      // Save to localStorage
      this.saveCart(updatedItems);
      
      // Dispatch event for components to listen
      this.dispatchCartUpdatedEvent(updatedItems);
      
      return updatedItems;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return this.getItems();
    }
  }
  
  // Update item quantity
  static updateQuantity(id: string, quantity: number): CartItem[] {
    try {
      if (quantity < 1) return this.getItems();
      
      const currentCart = this.getItems();
      const updatedItems = currentCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      // Save to localStorage
      this.saveCart(updatedItems);
      
      // Dispatch event for components to listen
      this.dispatchCartUpdatedEvent(updatedItems);
      
      return updatedItems;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      return this.getItems();
    }
  }
  
  // Remove item from cart
  static removeItem(id: string): CartItem[] {
    try {
      const currentCart = this.getItems();
      const updatedItems = currentCart.filter(item => item.id !== id);
      
      // Save to localStorage
      this.saveCart(updatedItems);
      
      // Dispatch event for components to listen
      this.dispatchCartUpdatedEvent(updatedItems);
      
      return updatedItems;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return this.getItems();
    }
  }
  
  // Clear cart
  static clearCart(): void {
    localStorage.removeItem('cartItems');
    this.dispatchCartUpdatedEvent([]);
  }
  
  // Get cart summary (subtotal, shipping, total, etc.)
  static getCartSummary(): CartSummary {
    const items = this.getItems();
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    
    // Calculate shipping (free shipping over 5,000,000 IDR)
    const shipping = subtotal > 5000000 ? 0 : 50000;
    
    // Apply any discounts (if applicable)
    const discount = 0; // This could be calculated based on promo codes, etc.
    
    // Calculate total
    const total = subtotal + shipping - discount;
    
    return {
      subtotal,
      shipping,
      discount,
      total,
      itemCount
    };
  }
  
  // Apply promo code
  static applyPromoCode(code: string): { success: boolean, discount: number, message: string } {
    // Example implementation - in a real app, this might call an API
    if (code.toUpperCase() === 'WELCOME10') {
      const subtotal = this.getItems().reduce((total, item) => total + (item.price * item.quantity), 0);
      const discount = subtotal * 0.1; // 10% discount
      return { 
        success: true, 
        discount, 
        message: 'Promo code applied successfully!' 
      };
    }
    
    return { 
      success: false, 
      discount: 0, 
      message: 'Invalid promo code' 
    };
  }
  
  // Private methods
  private static saveCart(items: CartItem[]): void {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }
  
  private static dispatchCartUpdatedEvent(cartItems: CartItem[]): void {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('cartUpdated', { 
        detail: { cartItems }
      });
      window.dispatchEvent(event);
    }
  }
}

export default CartController;
