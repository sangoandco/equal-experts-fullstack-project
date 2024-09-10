const cors = require('cors');
const express = require('express');

const app = express();

let groceries = [];

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json(groceries);
});

module.exports = app;

if (require.main === module) {
    app.listen(3333, () => {
        console.log('Server running on localhost:3333')
    });
}