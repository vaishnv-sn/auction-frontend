import React, { useState, useEffect } from 'react';
import AuctionItem from './AuctionItem';

const AuctionList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidLocks, setBidLocks] = useState({}); // { itemId: boolean }

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auction/items');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        console.error('Failed to fetch items');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    }
    setLoading(false);
  };

  const handleBid = async (itemId) => {
    if (bidLocks[itemId]) return; // Prevent if locked

    setBidLocks(prev => ({ ...prev, [itemId]: true }));

    try {
      const res = await fetch(`/api/auction/bid/${itemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();

      if (res.ok) {
        await fetchItems();
      } else {
        alert(result.message || 'Bid failed');
      }
    } catch (err) {
      alert('Bid error');
    }

    // Unlock bid button after 3 seconds
    setTimeout(() => {
      setBidLocks(prev => ({ ...prev, [itemId]: false }));
    }, 3000);
  };

  if (loading) return <div>Loading auction items...</div>;

  return (
    <div>
      {items.map(item => (
        <AuctionItem
          key={item.id}
          item={item}
          onBid={() => handleBid(item.id)}
          isLocked={!!bidLocks[item.id]}
        />
      ))}
    </div>
  );
};

export default AuctionList;
