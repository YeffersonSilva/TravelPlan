import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/itinerario/:path*",
    "/itinerarios",
    "/colaborativos",
    "/api/itinerarios/:path*",
  ],
};
