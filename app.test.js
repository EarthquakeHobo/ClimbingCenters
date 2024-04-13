'use strict';

const request = require('supertest');
const app = require('./app.js');

describe('Find matching discount days', () => {
    test('GET method for /DiscountOn?DDay=Monday succeeds', () => {
        return request(app)
	    .get('/DiscountOn?DDay=Monday')
	    .expect(200);
    });

    test('GET /DiscountOn?DDay=Monday returns JSON', () => {
        return request(app)
	    .get('/DiscountOn?DDay=Monday')
	    .expect('Content-type', /json/);
    });

    test('GET /DiscountOn?DDay=Monday includes VauxEast', () => {
        return request(app)
	    .get('/DiscountOn?DDay=Monday')
	    .expect(/VauxEast/);
    });

    test('DELETE /deleteCenter/:index succeeds', () => {
        return request(app)
          .delete('/deleteCenter/0')
          .expect(200);
      });
      
});