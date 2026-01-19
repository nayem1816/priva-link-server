function generateNumber(length) {
  let code = "";
  const numbers = "0123456789";

  for (let i = 0; i < length; i++) {
    code += numbers[Math.floor(Math.random() * numbers.length)];
  }

  return code;
}

module.exports = generateNumber;
