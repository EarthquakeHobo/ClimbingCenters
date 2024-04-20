'use strict';

const request = require('supertest');
const app = require('./app.js');
const fs = require('fs');

describe('Test Search and Delete', () => {
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


    test('POST /addcenter', () => {
        return request(app)
        .post('/addcenter')
        .expect(200);
        });    
        

    test('POST /addcenter Successfully adds test center', async () => {
        const TestCenter = {
            name: 'Test Center',
            DDay: 'Monday',
            Pin: [80.0, -8.135],
        };
    
        await request(app)
            .post('/addcenter')
            .send(TestCenter)
            .expect(200);

        const response = await request(app).get('/CentersAll');
        const updatedCentersAll = response.body;
    
        // uses some method to check if properties match
        const isTestCenterIncluded = updatedCentersAll.some(center => {
            return center.name === TestCenter.name &&
                center.DDay === TestCenter.DDay &&
                center.Pin[0] === TestCenter.Pin[0] &&
                center.Pin[1] === TestCenter.Pin[1];
        });
    
        expect(isTestCenterIncluded).toBe(true);
    });
        

});