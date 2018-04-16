"use strict";

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

const firebase = require('firebase');

const firebaseFunctionsTest = require('firebase-functions-test');

const admin = require('firebase-admin');

const sinon = require('sinon');

const secrets = require('./testSecrets');

let _initialized = false;
let user;
let token;
let fbTest;
module.exports = {
  init: function () {
    var _ref = _asyncToGenerator(function* () {
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
        user = yield firebase.auth().signInWithEmailAndPassword(secrets.testUserEmailAddress, secrets.testUserPassword);
        token = yield user.getIdToken();
        _initialized = true;
      }
    });

    return function init() {
      return _ref.apply(this, arguments);
    };
  }(),
  admin: () => require('firebase-admin'),
  auth: () => {
    return {
      user,
      token,
      uid: user.uid
    };
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