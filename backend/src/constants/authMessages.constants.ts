export enum AuthMessages {
  REGISTRATION_SUCCESS = "Registration successful",
  LOGIN_SUCCESS = "Login successful",
  TOKEN_REFRESHED = "Token refreshed",
  LOGOUT_SUCCESS = "Logout successful",
  USER_DATA_FETCHED = "User data fetched",
  PASSWORD_RESET_SUCESS = "Password reset successful. Please login again.",
}

export enum AuthErrors {
  EMAIL_EXISTS = "Email already exists",
  PHONE_EXISTS = "Phone number already exists",
  INVALID_CREDENTIALS = "Invalid credentials",
  INVALID_REFRESH_TOKEN = "Invalid refresh token",
  USER_NOT_FOUND = "User not found",
  INCORRECT_CURRENT_PASSWORD = "Current password is incorrect",
  SAME_PASSWORD = "New password must be different from current password",
}
