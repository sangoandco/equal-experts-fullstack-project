const request = require('supertest');
const app = require('../index');

describe(' GET / ', ()=> {
    it('grocery list should be empty on load', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});

describe('POST /', () => {
    it('should add a new item to the list', async () => {
      const response = await request(app)
        .post('/add-item')
        .send({ item_name: 'Butter'});
  
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: 1,
        item_name: 'Butter',
        purchased: false,
      });
  
      const getResponse = await request(app).get('/');
      expect(getResponse.body).toEqual([
        {
          id: 1,
          item_name: 'Butter',
          purchased: false,
        },
      ]);
    });

    it('should return a 400 status code if required item name is missing', async () => {
        const response = await request(app).post('/add-item').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Item name is required');
    });
});

describe('PUT /:id', () => {
    it('should toggle the purchased status of an item', async () => {
      const postResponse = await request(app)
      .post('/add-item')
      .send({ item_name: 'Butter' });
  
      const itemId = postResponse.body.id;
  
      const putResponse = await request(app).put(`/${itemId}`);
      expect(putResponse.status).toBe(200);
      expect(putResponse.body.purchased).toBe(true);
  
      const putResponse2 = await request(app).put(`/${itemId}`);
      expect(putResponse2.status).toBe(200);
      expect(putResponse2.body.purchased).toBe(false);
    });
  
    it('should return a 404 status code if the item is not found', async () => {
      const response = await request(app).put('/333');
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Item not found')
    })
  });

describe('PUT /edit/:id', () => {
    it('should update the item name', async () => {
  
      const postResponse = await request(app)
        .post('/add-item')
        .send({ item_name: 'Tea' });
  
      const itemId = postResponse.body.id;
  
      const putResponse = await request(app)
        .put(`/edit/${itemId}`)
        .send({ item_name: 'Coffee' });
      expect(putResponse.status).toBe(200);
      expect(putResponse.body).toEqual({
        id: itemId,
        item_name: 'Coffee',
        purchased: false,
      });
    });

    it('should return a 404 status code if the item to edit is not found', async () => {
        const response = await request(app).put('/edit/333').send({ item_name: 'Water' });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Item not found');
      });
});

describe('DELETE /:id', () => {
    it('should delete an item from the list', async () => {
      const postResponse = await request(app)
        .post('/add-item')
        .send({ item_name: 'Pampers' });
  
      const itemId = postResponse.body.id;
  
      const deleteResponse = await request(app).delete(`/${itemId}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.message).toBe('Item deleted successfully');
  
      const getResponse = await request(app).get('/');
      expect(getResponse.body).not.toEqual(
        expect.arrayContaining([{ id: itemId }])
      );
    });
  
    it('should return a 404 status code if the item to delete is not found', async () => {
      const response = await request(app).delete('/333');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Item not found');
    });
  });