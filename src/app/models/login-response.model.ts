export interface LoginResponse {
  message: string;
  token: string;
  user: { username: string }; // match your backend
}
