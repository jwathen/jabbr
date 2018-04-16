import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { GeoPoint } from '@google-cloud/firestore';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { user } from 'firebase-functions/lib/providers/auth';

admin.initializeApp(functions.config().firebase);

const extractUid = async req => {
  try {
    if (!req.headers.Authorization || !req.headers.Authorization.startsWith('Bearer ')) {
      return null;
    }
    const encodedToken = req.headers.Authorization.split('Bearer ')[1];

    const decodedToken = await admin.auth().verifyIdToken(encodedToken);
    return decodedToken.uid;
  } catch (ex) {
    console.error('Unable to decode auth token. ' + ex);
    return null;
  }
};

export const userPing = functions.https.onRequest(async (req, res) => {
  const uid = await extractUid(req);
  if (!uid) {
    throw new HttpsError('unauthenticated');
  }

  const loc = req.body.loc;
  if (!loc || !loc.latitude || !loc.longitude) {
    throw new HttpsError('invalid-argument');
  }

  var db = admin.firestore();
  await db
    .collection('users')
    .doc(uid)
    .set(
      {
        location: new GeoPoint(loc.latitude, loc.longitude),
        locationUpdateTime: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );
  res.status(200);
});
