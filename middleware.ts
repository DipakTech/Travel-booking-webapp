export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/book/:path*",
    "/profile/:path*",
    // Add other protected routes here
  ],
};
