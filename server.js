const fs = require('fs');

var Datastore = require('nedb')
    , db = new Datastore({ filename: 'data.db' });
db.loadDatabase(function (err) {    // Callback is optional
    // Now commands will be executed
    if (err) {
        console.error(err);
        process.exit();
    }
});

const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    try {
        db.find({}, (err, docs) => {
            if (err) {
                throw err;
            } else {
                res.status(200).send(docs)
            }

        })
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
})


app.post('/', (req, res) => {
    try {
        db.insert(req.body, (err, todo) => {
            if (err) {
                throw err;
            } else {
                res.status(200).send(todo)
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
})

app.put('/:id', (req, res) => {
    try {
        // find id in data and replace it
        db.update({ _id: req.params.id }, req.body, {}, (err) => {
            if (err) {
                throw err;
            } else {
                res.sendStatus(200);
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }

})

app.patch('/:id', (req, res) => {
    try {
        // find id in data and patch it
        let id = req.params.id;
        if (id && id != 'undefined') {

            db.update({ _id: id }, { $set: req.body }, {}, (err) => {
                if (err) {
                    throw err;
                } else {
                    res.sendStatus(200);
                }
            })
        } else {
            res.status(400).send('Invalid ID')
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }

})

app.delete('/:id', (req, res) => {
    try {
        db.remove({ _id: req.params.id }, {}, (err) => {
            if (err) {
                throw err;
            } else {
                res.sendStatus(200);
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})