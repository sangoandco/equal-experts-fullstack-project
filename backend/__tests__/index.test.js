const request = require('supertest');
const app = require('../index');

describe(' GET / ', ()=> {
    it('grocery list should be empty on load', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});
