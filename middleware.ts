export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/itinerario/:path*", "/itinerarios", "/api/itinerarios/:path*"],
};
