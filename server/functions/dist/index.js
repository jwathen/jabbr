"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userPing = void 0;

var admin = _interopRequireWildcard(require("firebase-admin"));

var functions = _interopRequireWildcard(require("firebase-functions"));

var _firestore = require("@google-cloud/firestore");

var _https = require("firebase-functions/lib/providers/https");

var _auth = require("firebase-functions/lib/providers/auth");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

admin.initializeApp(functions.config().firebase);

const extractUid =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (req) {
    try {
      if (!req.headers.Authorization || !req.headers.Authorization.startsWith('Bearer ')) {
        return null;
      }

      const encodedToken = req.headers.Authorization.split('Bearer ')[1];
      const decodedToken = yield admin.auth().verifyIdToken(encodedToken);
      return decodedToken.uid;
    } catch (ex) {
      console.error('Unable to decode auth token. ' + ex);
      return null;
    }
  });

  return function extractUid(_x) {
    return _ref.apply(this, arguments);
  };
}();

const userPing = functions.https.onRequest(
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (req, res) {
    const uid = yield extractUid(req);

    if (!uid) {
      throw new _https.HttpsError('unauthenticated');
    }

    const loc = req.body.loc;

    if (!loc || !loc.latitude || !loc.longitude) {
      throw new _https.HttpsError('invalid-argument');
    }

    var db = admin.firestore();
    yield db.collection('users').doc(uid).set({
      location: new _firestore.GeoPoint(loc.latitude, loc.longitude),
      locationUpdateTime: admin.firestore.FieldValue.serverTimestamp()
    }, {
      merge: true
    });
    res.status(200);
  });

  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}());
exports.userPing = userPing;