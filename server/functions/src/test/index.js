require('mocha');
const assert = require('assert');
const test = require('./testHelpers');

describe('userPing', async () => {
  it("should save the user's location", async () => {
    await test.init();
    const jabbrFunctions = require('../index');

    var req = test.authorizedRequest();
    req.body.loc = { latitude: Math.random() * 180, longitude: Math.random() * 180 };
    jabbrFunctions.userPing(req, { status: () => {} });
    const userDoc = await test
      .admin()
      .firestore()
      .doc(`users/${test.auth().uid}/`)
      .get();
    console.log(userDoc);
  });
});
