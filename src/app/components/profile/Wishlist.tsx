import { useState } from 'react';

export default function Wishlist() {
  // Sample wishlist data - in a real app, you'd fetch this from an API
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Handwoven Batik Tunic',
      price: '$149.00',
      imageUrl: '/images/product-1.jpg'
    },
    {
      id: 2,
      name: 'Traditional Tenun Shawl',
      price: '$89.00',
      imageUrl: '/images/product-2.jpg'
    },
    {
      id: 3,
      name: 'Batik Pattern Face Mask',
      price: '$15.00',
      imageUrl: '/images/product-3.jpg'
    }
  ]);

  const removeFromWishlist = (itemId) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
  };

  const addToCart = (item) => {
    // In a real app, you'd call an API to add to cart
    alert(`Added ${item.name} to cart!`);
    removeFromWishlist(item.id);
  };

  return (
    <div>
      <h2 className="text-2xl font-normal text-black mb-6">My Wishlist</h2>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Your wishlist is empty.</p>
          <a
            href="/shop"
            className="inline-block mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition"
          >
            CONTINUE SHOPPING
          </a>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => wishlistItems.forEach(item => addToCart(item))}
              className="px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-900 transition"
            >
              ADD ALL TO CART
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-[200px] object-cover"
                    />
                  ) : (
                    <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium mb-2">{item.name}</h3>
                  <p className="text-lg mb-4">{item.price}</p>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full py-2 bg-black text-white text-sm rounded-full hover:bg-gray-900 transition"
                    >
                      ADD TO CART
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-full py-2 border border-black text-black text-sm rounded-full hover:bg-gray-100 transition"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
