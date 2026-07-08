export function validateEmail(email: string): string | null {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!re.test(email)) return "Invalid email address";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters long";
  return null;
}

export function validateUsername(username: string): string | null {
  if (!username) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters long";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can only contain alphanumeric characters and underscores";
  }
  return null;
}

export function validateConfirmPassword(pass: string, confirm: string): string | null {
  if (!confirm) return "Confirm password is required";
  if (pass !== confirm) return "Passwords do not match";
  return null;
}

export function validateHandle(handle: string): string | null {
  if (handle && handle.trim().length > 0) {
    if (!/^[a-zA-Z0-9_\-\.]+$/.test(handle)) {
      return "Handle can only contain alphanumeric characters, underscores, dashes, and periods";
    }
  }
  return null;
}
