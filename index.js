const dynamoService = require('./dynamoService');
exports.handler = async (event) => {
	if (event.httpMethod == "POST")
	{
		
		if (event.body !== null && event.body !== undefined && (event.headers['Content-Type'] === "application/json" || event.headers['content-type'] === "application/json")) 
		{
			
			try 
			{
				var bookData = JSON.parse(event.body);
				return await InsertBookData(bookData);
			} catch (e) {
				let error  = {
					message: "Invalid parameters"
				};

				return GenerateResponse(400, error);
			}	
		} else {
				
			let error  = {
				message: "Invalid parameters"
			};

			return GenerateResponse(400, error);
		}
			
	} 
	else if (event.httpMethod == "GET" && event.pathParameters.book_id != null)
	{
		return await RetreiveBook(event.pathParameters.book_id);
	} 
	else if (event.httpMethod == "PUT" && event.pathParameters.book_id != null && event.body !== null && event.body !== undefined)
	{
		try 
		{
			var bookData = JSON.parse(event.body);
			return await UpdateBookData(event.pathParameters.book_id, bookData);
		} catch (e) {
			let error  = {
				message: "Unable to update the bookData"
			};

			return GenerateResponse(400, error);    
		}
	}
	else 
	{
		let error  = {
			message: "Not Allowed"
		};

		return GenerateResponse(405, error);
	}

};

async function RetreiveBook (book_id) {
	const result = await dynamoService.DynamoRetreiveBook(book_id)
	const response = GenerateResponse(result.statusCode, result.data);           
	return  response;     
}

async function InsertBookData (bookData) {
	const result = await dynamoService.DynamoInsertBook(bookData)
	const response = GenerateResponse(result.statusCode, result.data);          
	return  response;
}

async function UpdateBookData(book_id, bookData) {
	const result = await dynamoService.DynamoUpdateBook(book_id, bookData)
	const response = GenerateResponse(result.statusCode, result.data);           
	return  response;
}

function GenerateResponse(statusCode, data) {
	let response = {
		statusCode: statusCode,
		headers: {
			"Content-Type" : "application/json",
			"Access-Control-Allow-Origin": "*"
		},
		body: JSON.stringify(data)
	}				
	return response;
}