export default function OrderHistory() {
    // Sample order data - in a real app, you'd fetch this from an API
    const orders = [
      {
        id: 'ORD-2025-001',
        date: 'April 26, 2025',
        status: 'Delivered',
        total: '$269.00',
        items: [
          { name: 'White Cotton Blouse', price: '$129.00', quantity: 1 },
          { name: 'Linen Pants', price: '$140.00', quantity: 1 }
        ]
      },
      {
        id: 'ORD-2025-002',
        date: 'April 15, 2025',
        status: 'Processing',
        total: '$85.50',
        items: [
          { name: 'Silk Scarf', price: '$45.50', quantity: 1 },
          { name: 'Leather Belt', price: '$40.00', quantity: 1 }
        ]
      }
    ];
  
    return (
      <div>
        <h2 className="text-2xl font-normal text-black mb-6">Order History</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-50 p-6 border-b flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'Delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                    <span className="font-medium">{order.total}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Items</h3>
                  <ul className="space-y-4">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <div>
                          <p>{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <span>{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-6 bg-gray-50 border-t flex justify-end">
                  <button className="px-4 py-2 text-sm border border-black text-black hover:bg-black hover:text-white transition rounded-full">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  