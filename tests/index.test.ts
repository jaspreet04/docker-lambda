import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
const { handler } = require('../index');
const dynamoService = require('../dynamoService');

describe('lambdaService', () => {
  beforeEach(() => {

  });

  it('GET: No Record Found with invalid key', async () => {

    const mResponse = { statusCode: 404, data: { message : "No Record Found" }};
    vi.spyOn(dynamoService, 'DynamoRetreiveBook').mockImplementationOnce(() => mResponse)
    // donot pass the data content type in headers
    const mEvent =  {
        headers: {}, // Pass on request headers
        body: {}, // Pass on request body
        httpMethod: 'GET', // method type
        pathParameters: { book_id : 'werrr'}
    }
    let lambdaResponse = await handler(mEvent);
    
    let response = JSON.parse(lambdaResponse.body)
    expect(response.message).toBe('No Record Found')
    expect(lambdaResponse.statusCode).toBe(404)
  });

  it('GET: No Record Found with invalid key', async () => {
    
    const mResponse = { statusCode: 403, data: { message : "Unable to read item." }};
    vi.spyOn(dynamoService, 'DynamoRetreiveBook').mockImplementationOnce(() => mResponse)
    // donot pass the data content type in headers
    const mEvent =  {
        headers: {}, // Pass on request headers
        body: {}, // Pass on request body
        httpMethod: 'GET', // method type
        pathParameters: { book_id : 'werrr'}
    }
    let lambdaResponse = await handler(mEvent);

    let response = JSON.parse(lambdaResponse.body)
    expect(response.message).toBe('Unable to read item.')
    expect(lambdaResponse.statusCode).toBe(403)
  });

  it('POST: Invalid parameters POST', async () => {
    const mResponse = { statusCode: 200, data: { message : "No Record Found" }};
    vi.spyOn(dynamoService, 'DynamoInsertBook').mockImplementationOnce(() => mResponse)
    // donot pass the data content type in headers
    const mEvent =  {
        headers: {}, // Pass on request headers
        body: {}, // Pass on request body
        httpMethod: 'POST' // method type
    }
    let lambdaResponse = await handler(mEvent);

    let response = JSON.parse(lambdaResponse.body)
    expect(response.message).toBe('Invalid parameters')
  });

  it('POST: successful insert', async () => {
    const mResponse = { statusCode: 200, data: { book_id : "1234" }};
    vi.spyOn(dynamoService, 'DynamoInsertBook').mockImplementationOnce(() => mResponse)
    // donot pass the data content type in headers
    const mEvent =  {
        headers: {
			"Content-Type" : "application/json"
		}, 
        body: `{
            "book_name": "Book Name",
            "Author": "Book Author"
        }`, // Pass on request body
        httpMethod: 'POST' // method type
    }
    let lambdaResponse = await handler(mEvent);
    
    let response = JSON.parse(lambdaResponse.body)
    expect(response.book_id).toBe(mResponse.data.book_id)
  });

  it('POST: successful insert', async () => {
    const mResponse = { statusCode: 200, data: { book_id : "1234" }};
    vi.spyOn(dynamoService, 'DynamoInsertBook').mockImplementationOnce(() => mResponse)
    // donot pass the data content type in headers
    const mEvent =  {
        headers: {
			"Content-Type" : "application/json"
		}, 
        body: `{
          "book_name": "Book Name",
          "Author": "Book Author"
        }`, // Pass on request body
        httpMethod: 'POST' // method type
    }
    let lambdaResponse = await handler(mEvent);
    
    let response = JSON.parse(lambdaResponse.body)
    expect(response.book_id).toBe(mResponse.data.book_id)
  });

  it('Update: successful update', async () => {
    const body = {
      "book_name": "Book Name",
      "author": "Book Author"
    }
    const mResponse = { statusCode: 200, data: { book_id: "update",book_data : body }};
    vi.spyOn(dynamoService, 'DynamoUpdateBook').mockImplementationOnce(() => mResponse)
    // donot pass the data content type in headers
    const mEvent =  {
        headers: {
			"Content-Type" : "application/json"
		}, 
        body: JSON.stringify(body), // Pass on request body
        httpMethod: 'PUT', // method type
        pathParameters: { book_id : 'update'}
    }
    let lambdaResponse = await handler(mEvent);
    
    const response = JSON.parse(lambdaResponse.body)
    expect(response.book_id).toBe(mResponse.data.book_id)
    expect(response.book_data.book_name).toBe(mResponse.data.book_data.book_name)
  });
  
});