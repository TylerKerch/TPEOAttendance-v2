const firebase = require("firebase-admin");
require('dotenv').config()

const serviceAccount = JSON.parse(
  process.env.SERVICE_ACCOUNT
)
firebase.initializeApp({
  credential: firebase.credential.cert(credentials)
});

module.exports = firebase;
