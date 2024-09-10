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