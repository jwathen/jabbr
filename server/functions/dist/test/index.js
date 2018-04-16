"use strict";

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

require('mocha');

const assert = require('assert');

const test = require('./testHelpers');

describe('userPing',
/*#__PURE__*/
_asyncToGenerator(function* () {
  it("should save the user's location",
  /*#__PURE__*/
  _asyncToGenerator(function* () {
    yield test.init();

    const jabbrFunctions = require('../index');

    var req = test.authorizedRequest();
    req.body.loc = {
      latitude: Math.random() * 180,
      longitude: Math.random() * 180
    };
    jabbrFunctions.userPing(req, {
      status: () => {}
    });
    const userDoc = yield test.admin().firestore().doc(`users/${test.auth().uid}/`).get();
    console.log(userDoc);
  }));
}));