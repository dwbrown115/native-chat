export default function isPasswordValid(password: string) {
  // Define the regular expression pattern
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/;

  // Test if the password matches the pattern
  return passwordPattern.test(password);
}
