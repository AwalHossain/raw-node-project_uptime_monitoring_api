const crypto = require("crypto");

// / module scaffolding
const utilities = {};

utilities.parseJSON = (jsonString) => {
  let output = {};
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

// hasing the pssword

utilities.hash = (str) => {
  if (typeof (str) === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", "password")
      .update(str)
      .digest("hex");

    return hash;
  }

  return false;
};
utilities.createRandomStr = (strLength) => {

  let length = strLength;
  length = typeof (strLength) === 'number' && strLength > 0 ? strLength : false

  if (length) {
    let possibelCharacters = 'abcdefghijklmnopqrst0123456789';
    let output = '';
    for (let i = 1; i <= length; i++) {
      let randomCharacter = possibelCharacters.charAt(Math.floor(Math.random() * possibelCharacters.length))
      output += randomCharacter;
    }
    return output;
  }

  return false;
};

module.exports = utilities;
