const path = require('path')
const express = require('express')
const lambdaLocal = require('lambda-local')

const app = express()

app.use(express.json())

app.get('/book/:book_id', async (req, res) => {
  const result = await lambdaLocal.execute({
    lambdaPath: path.join(__dirname, 'index'),
    lambdaHandler: 'handler',
    event: {
            headers: req.headers, // Pass on request headers
            body: JSON.stringify(req.body), // Pass on request body
            httpMethod: "GET",
            pathParameters: req.params
        }
    })

    // Respond to HTTP request
    res
    .status(result.statusCode)
    .set(result.headers)
    .set(result.httpMethod)
    .set(result.pathParameters)
    .end(result.body)
})

app.post('/book/add', async (req, res) => {
    const result = await lambdaLocal.execute({
        lambdaPath: path.join(__dirname, 'index'),
        lambdaHandler: 'handler',
        event: {
                headers: req.headers, // Pass on request headers
                body: JSON.stringify(req.body), // Pass on request body
                httpMethod: "POST",
            }
    })
    // Respond to HTTP request
    res
    .status(result.statusCode)
    .set(result.headers)
    .set(result.httpMethod)
    .end(result.body)
})

app.options('/book', async (req, res) => {
    const headers = {
        "Content-Type" : "application/json",
        "access-control-allow-methods": "OPTIONS,POST,PUT",
        "access-control-allow-origin": "*",
        "Access-Control-Allow-Headers": "*"
    }
    // Respond to HTTP request
    res
    .status(200)
    .set(headers)
    .end("")
})

app.put('/book/:book_id', async (req, res) => {

    const result = await lambdaLocal.execute({
        lambdaPath: path.join(__dirname, 'index'),
        lambdaHandler: 'handler',
        event: {
                headers: req.headers, // Pass on request headers
                body: JSON.stringify(req.body), // Pass on request body
                httpMethod: "PUT",
                pathParameters: req.params
            }
    })

    // Respond to HTTP request
    res
    .status(result.statusCode)
    .set(result.headers)
    .set(result.httpMethod)
    .end(result.body)
})

app.listen(3000, () => console.log('listening on port: 3000'))