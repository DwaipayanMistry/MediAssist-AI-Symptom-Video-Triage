export type JwtPayload = {
  id: string;
  role: "poatient" | "doctor" | "admin";
  email?: string;
  name?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
