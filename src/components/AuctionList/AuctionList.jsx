import React, { useState, useEffect } from "react";
import AuctionItem from "./AuctionItem";

const AuctionList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidLocks, setBidLocks] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();

    // Optional: Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchItems, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:4000/api/auctionItems", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setItems(data.items || data); // Handle both { items: [] } and direct array responses
      } else if (res.status === 401) {
        setError("Session expired. Please log in again.");
        // Optionally redirect to login page
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Failed to fetch auction items");
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Network error. Please check your connection.");
    }

    setLoading(false);
  };

  const handleBid = async (itemId) => {
    if (bidLocks[itemId]) return; // Prevent if locked

    // Find the current item to get minimum bid info
    const currentItem = items.find((item) => item.id === itemId);
    if (!currentItem) {
      alert("Item not found");
      return;
    }

    // Calculate minimum bid (current highest bid + 1 or starting price + 1)
    const currentHighest =
      currentItem.lastBidAmount || currentItem.startingPrice;
    const minimumBid = currentHighest + 1;

    // Get bid amount from user
    const bidAmountStr = prompt(
      `Enter your bid amount:\n\nCurrent Highest: ₹${currentHighest.toLocaleString()}\nMinimum Bid: ₹${minimumBid.toLocaleString()}`
    );

    // Check if user cancelled or entered empty value
    if (!bidAmountStr || bidAmountStr.trim() === "") {
      return;
    }

    // Parse and validate bid amount
    const bidAmount = parseFloat(bidAmountStr.trim());

    if (isNaN(bidAmount)) {
      alert("Please enter a valid number");
      return;
    }

    if (bidAmount < minimumBid) {
      alert(`Bid must be at least ₹${minimumBid.toLocaleString()}`);
      return;
    }

    setBidLocks((prev) => ({ ...prev, [itemId]: true }));

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in to place a bid.");
        setBidLocks((prev) => ({ ...prev, [itemId]: false }));
        return;
      }

      const res = await fetch(`http://localhost:4000/api/createBid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: itemId,
          amount: bidAmount,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        // Refresh items to show updated bid
        await fetchItems();
        alert(
          `Bid placed successfully! Your bid: ₹${bidAmount.toLocaleString()}`
        );
      } else {
        alert(result.message || "Bid failed");
      }
    } catch (err) {
      console.error("Bid error:", err);
      alert("Network error while placing bid. Please try again.");
    }

    setBidLocks((prev) => ({ ...prev, [itemId]: false }));
  };

  const handleRefresh = () => {
    fetchItems();
  };

  if (loading && items.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
          fontSize: "16px",
          color: "#666",
        }}
      >
        Loading auction items...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          backgroundColor: "#fee",
          border: "1px solid #fcc",
          borderRadius: "8px",
          margin: "1rem",
        }}
      >
        <p style={{ color: "#c33", marginBottom: "1rem" }}>{error}</p>
        <button
          onClick={handleRefresh}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "#666",
        }}
      >
        <p>No auction items available at the moment.</p>
        <button
          onClick={handleRefresh}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ margin: 0, color: "#2c3e50" }}>
          Auction Items ({items.length})
        </h2>
        <button
          onClick={handleRefresh}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: loading ? "#bdc3c7" : "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
          }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "1rem",
        }}
      >
        {items.map((item) => (
          <AuctionItem
            key={item.id}
            item={item}
            onBid={() => handleBid(item.id)}
            isLocked={!!bidLocks[item.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default AuctionList;
