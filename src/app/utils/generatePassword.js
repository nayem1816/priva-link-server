function generatePassword() {
  const specialChars = "!@#$%^&*";
  const numbers = "0123456789";
  const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";

  // Ensuring at least one of each type
  let password = "";
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password +=
    upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
  password +=
    lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];

  // Remaining characters to fill the 8-digit length
  const allChars = specialChars + numbers + upperCaseLetters + lowerCaseLetters;
  for (let i = password.length; i < 8; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to randomize character positions
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}

module.exports = generatePassword;
