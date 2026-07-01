const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    try {
        const data = read();
        res.send(data);

    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
})


app.post('/', (req, res) => {
    try {
        const todo = req.body;
        todo.id = uuidv4();
        let data = read();
        data.push(todo);
        save(data);
        res.status(200).send(todo)

    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
})

app.put('/:id', (req, res) => {
    try {
        // find id in data and replace it
        let id = req.params.id;
        let data = read();
        let todo = data.find(d => d.id == id);
        todo.text = req.body.text;
        todo.done = req.body.done;
        save(data);
        res.status(200).send(todo)
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
            let data = read();
            let todo = data.find(d => d.id == id);
            if (req.body.text) {
                todo.text = req.body.text;
            }

            if (req.body.done) {
                todo.done = req.body.done;
            }
            save(data);
            res.status(200).send(todo)
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
        // find id in data and remove it
        let id = req.params.id;
        let data = read();
        data = data.filter(d => d.id != id);
        save(data);
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function save(data) {
    fs.writeFileSync('./data.json', JSON.stringify(data));
}

function read() {
    if (!fs.existsSync('./data.json')) {
        save([]);
        return [];
    } else {
        return require('./data.json');
    }
}


function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}