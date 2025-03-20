import { ImageResponse } from "next/server";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 48,
          color: "white",
          background: "linear-gradient(to bottom, #2563eb, #3b82f6)",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21C15.866 21 19 17.866 19 14C19 12.1145 18.1305 10.2683 16.5 9C15.5 8.5 14.5 8.5 14 8C13.5 7.5 13.5 6.5 13.5 6.5C13.5 5 12 3.5 9 3.5C5.5 3.5 3 7 3 9.5C3 12.5 4.5 14 5.5 15C6.5 16 5 16.5 4.5 17.5C4 18.5 4 21 12 21Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ marginLeft: "16px" }}>Travel Booking</span>
        </div>
        <div style={{ fontSize: "64px", fontWeight: "bold", margin: "20px 0" }}>
          Edit Destination
        </div>
        <div style={{ fontSize: "24px", opacity: 0.8 }}>
          Manage your travel destinations with ease
        </div>
      </div>
    ),
    { ...size },
  );
}
