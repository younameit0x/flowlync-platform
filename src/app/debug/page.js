"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function DebugPage() {
  const { user, error, isLoading } = useUser();

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Auth0 Debug Page</h1>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          margin: "10px 0",
        }}
      >
        <h2>Status:</h2>
        <p>
          <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
        </p>
        <p>
          <strong>Has User:</strong> {user ? "Yes" : "No"}
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#fff3cd",
          padding: "15px",
          margin: "10px 0",
        }}
      >
        <h2>Error:</h2>
        <pre style={{ backgroundColor: "#fff", padding: "10px" }}>
          {error ? JSON.stringify(error, null, 2) : "No error"}
        </pre>
      </div>

      <div
        style={{
          backgroundColor: "#d4edda",
          padding: "15px",
          margin: "10px 0",
        }}
      >
        <h2>User Data:</h2>
        <pre
          style={{ backgroundColor: "#fff", padding: "10px", overflow: "auto" }}
        >
          {user ? JSON.stringify(user, null, 2) : "No user logged in"}
        </pre>
      </div>

      <div
        style={{
          backgroundColor: "#cce5ff",
          padding: "15px",
          margin: "10px 0",
        }}
      >
        <h2>Auth0 Actions:</h2>
        <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
          <Link
            href="/api/auth/login"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: "5px",
              display: "inline-block",
              width: "fit-content",
            }}
          >
            🔐 Login to Auth0
          </Link>
          <Link
            href="/api/auth/logout"
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: "5px",
              display: "inline-block",
              width: "fit-content",
            }}
          >
            🚪 Logout
          </Link>
          <Link
            href="/api/auth/me"
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: "5px",
              display: "inline-block",
              width: "fit-content",
            }}
          >
            👤 View Profile API
          </Link>
          <Link
            href="/"
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: "5px",
              display: "inline-block",
              width: "fit-content",
            }}
          >
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
