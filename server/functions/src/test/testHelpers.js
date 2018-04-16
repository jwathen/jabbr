const firebase = require('firebase');
const firebaseFunctionsTest = require('firebase-functions-test');
const admin = require('firebase-admin');
const sinon = require('sinon');
const secrets = require('./testSecrets');

let _initialized = false;
let user;
let token;
let fbTest;
let admin;

module.exports = {
  init: async () => {
    if (!_initialized) {
      var config = {
        apiKey: secrets.firebaseApiKey,
        authDomain: 'jabbr-8a61e.firebaseapp.com',
        databaseURL: 'https://jabbr-8a61e.firebaseio.com',
        projectId: 'jabbr-8a61e',
        storageBucket: 'jabbr-8a61e.appspot.com',
        credential: admin.credential.cert(require('./serviceAccountKey.json'))
      };

      fbTest = firebaseFunctionsTest(config, './serviceAccountKey.json');
      firebase.initializeApp(config);
      admin.initializeApp(config);
      sinon.stub(admin, 'initializeApp');
      user = await firebase.auth().signInWithEmailAndPassword(secrets.testUserEmailAddress, secrets.testUserPassword);
      token = await user.getIdToken();

      _initialized = true;
    }
  },
  admin: () => require('firebase-admin'),
  auth: () => {
    return { user, token, uid: user.uid };
  },
  authorizedRequest: () => {
    var req = unauthorizedRequest();
    req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  unauthorizedRequest: () => {
    return {
      body: {},
      method: 'POST',
      contentType: 'application/json',
      header: name => headers[name],
      headers: {
        'Content-Type': 'application/json'
      }
    };
  },
  fbTest: () => fbTest
};
