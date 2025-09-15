import React from "react";

const AuctionItem = ({ item, onBid, isLocked }) => {
  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Get current bid amount or starting price
  const currentBid = item.lastBidAmount || item.startingPrice;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        margin: "0.5rem",
        padding: "1rem",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3 style={{ margin: "0 0 1rem 0", color: "#333" }}>{item.title}</h3>

      <p style={{ margin: "0.5rem 0", color: "#666", fontSize: "14px" }}>
        {item.description}
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <p style={{ margin: "0.25rem 0", fontWeight: "bold" }}>
          Starting Price: ₹{item.startingPrice.toLocaleString()}
        </p>

        {item.lastBidAmount ? (
          <>
            <p
              style={{
                margin: "0.25rem 0",
                color: "#e74c3c",
                fontWeight: "bold",
              }}
            >
              Current Highest Bid: ₹{item.lastBidAmount.toLocaleString()}
            </p>
            <p style={{ margin: "0.25rem 0", fontSize: "12px", color: "#777" }}>
              Last Bid Time: {formatDate(item.lastBidTime)}
            </p>
            <p style={{ margin: "0.25rem 0", fontSize: "12px", color: "#777" }}>
              Bidder ID: {item.bidderId}
            </p>
          </>
        ) : (
          <p style={{ margin: "0.25rem 0", color: "#27ae60" }}>
            No bids yet - Start bidding!
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={onBid}
          disabled={isLocked || item.status !== "active"}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor:
              isLocked || item.status !== "active" ? "#bdc3c7" : "#3498db",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor:
              isLocked || item.status !== "active" ? "not-allowed" : "pointer",
            fontSize: "14px",
          }}
        >
          {isLocked
            ? "Please wait..."
            : item.status !== "active"
            ? "Auction Ended"
            : "Place Bid"}
        </button>

        <span
          style={{
            fontSize: "12px",
            color: item.status === "active" ? "#27ae60" : "#e74c3c",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          {item.status}
        </span>
      </div>
    </div>
  );
};

export default AuctionItem;
