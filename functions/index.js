const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();

var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://streamy-serverless-api.firebaseio.com"
});
const db = admin.firestore();


app.use(cors({ origin: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/hello-world', (req, res) => {
  return res.status(200).send('Hello World!');
});
// create
app.post('/api/create', (req, res) => {
    (async () => {
        try {
          await db.collection('streams').add({
            title: req.body.title,
          	description: req.body.description,
          	googleUser:req.body.googleUser
          }).then(ref => {
			  console.log('Added document with ID: ', ref.id);
			  console.log(req.body);
			  return null;
			});
          return res.status(200).send();
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })();
  });

// read item
app.get('/api/read/:item_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('streams').doc(req.params.item_id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

// read all
app.get('/api/read', (req, res) => {
    (async () => {
        try {
            let query = db.collection('streams');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        item: doc.data()
                    };
                    response.push(selectedItem);
                }
                return response;
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

// update
app.patch('/api/update/:item_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('streams').doc(req.params.item_id);
        await document.update({
            description: req.body.description,
            title: req.body.title
        });
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});

// delete
app.delete('/api/delete/:item_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('streams').doc(req.params.item_id);
        await document.delete();
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});
//
//
//
//
// create
app.post('/hplc_api/create', (req, res) => {
    (async () => {
        try {
          await db.collection('shimadzu-hplc').add({
            ERR_DATE_TIME: req.body.DATE_TIME,
            HPLC_ID: req.body.HPLC_ID,
            HPLC_STATE: req.body.STATE
          }).then(ref => {
              console.log('Added document with ID: ', ref.id);
              console.log(req.body);
              return null;
            });
          return res.status(200).send();
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })();
  });

// read item
app.get('hplc_/api/read/:item_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('shimadzu-hplc').doc(req.params.item_id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

// read all
app.get('hplc_api/read', (req, res) => {
    (async () => {
        try {
            let query = db.collection('shimadzu-hplc');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        item: doc.data()
                    };
                    response.push(selectedItem);
                }
                return response;
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

// update
// app.patch('/hplc_api/update/:item_id', (req, res) => {
// (async () => {
//     try {
//         const document = db.collection('shimadzu-hplc').doc(req.params.item_id);
//         await document.update({
//             ERR_DATE_TIME: req.body.ERR_DATE_TIME,
//             HPLC_ID: req.body.title
//         });
//         return res.status(200).send();
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send(error);
//     }
//     })();
// });

// delete
app.delete('hplc_api/delete/:item_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('shimadzu-hplc').doc(req.params.item_id);
        await document.delete();
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});



exports.app = functions.https.onRequest(app);