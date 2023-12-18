const ecc = require("eosjs-ecc");
const { PrivateKey } = require("eosjs-ecc/lib/api_object");

const generateKey = async () => {
  const privateKey = await ecc.randomKey(); // Generate a new random Private Key
  const publicKey = ecc.privateToPublic(privateKey); // Returns the Public Key derived from privKey
  console.log("privetKaey", privateKey);
  console.log("publicKey", publicKey);

  // Check if a Public Key is valid
  console.log("Is Valid Public Key");
  console.log(ecc.isValidPublic(publicKey));

  // Check if a Private Key is valid
  console.log("Is Valid Private Key");
  console.log(ecc.isValidPrivate(privateKey));
};

generateKey();
generateKey();