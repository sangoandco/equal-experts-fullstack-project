const cors = require('cors');
const express = require('express');

const app = express();

let groceries = [];

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json(groceries);
});

app.post('/add-item', (req, res) => {
    const { item_name } = req.body;

    if (!item_name) {
        return res.status(400).json({ message: 'Item name is required' });
    }

    const newItem = {
        id: groceries.length + 1,
        item_name,
        purchased: false,
    };

    groceries.push(newItem);

    res.status(201).json(newItem);
});

app.put('/:id', (req, res) => {
    const { id } = req.params;
    const itemId = parseInt(id);
  
    const item = groceries.find((grocery) => grocery.id === itemId);
  
    if (!item) {
      return res.status(404).json({ message: 'Item not found'});
    }
  
    item.purchased = !item.purchased;
  
    res.status(200).json(item);
  });

app.put('/edit/:id', (req,res) => {
    const { id } = req.params;
    const { item_name } = req.body;
    const itemId = parseInt(id);
  
    const item = groceries.find((grocery) => grocery.id === itemId);
  
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
  
    if (item_name) item.item_name = item_name;
  
    res.status(200).json(item);
});

app.delete('/:id', (req, res) => {
    const { id } = req.params;
    const itemId = parseInt(id);
  
    const itemIndex = groceries.findIndex((grocery) => grocery.id === itemId);
  
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }
  
    groceries.splice(itemIndex, 1);
  
    res.status(200).json({ message: 'Item deleted successfully' });
});

module.exports = app;

if (require.main === module) {
    app.listen(3333, () => {
        console.log('Server running on localhost:3333')
    });
}