const AWS = require("aws-sdk");
const IS_OFFLINE = process.env.NODE_ENV == 'development'
let options = {}

// connect to local DB if running offline
if (IS_OFFLINE) {
	const DYNAMO_ENDPOINT = process.env.DYNAMO_ENDPOINT
	options = {
		region: process.env.AWS_REGION,
		endpoint: DYNAMO_ENDPOINT,
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	}
}

const DynamoDb = new AWS.DynamoDB.DocumentClient(options);
const BOOKS_TABLE_NAME = process.env.BOOKS_TABLE_NAME;
const MIN_KEY_LENGTH = 5;
const MAX_KEY_LENGTH = 6;
const KEY_ALLOWED_CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyz'
const TTL = 86400 * 7; // increased the data expiration ot 7 days from 3

module.exports = {
  DynamoInsertBook: async (bookData) => {
    const result = await InsertBook(bookData)
    return result
  },
  DynamoRetreiveBook: async (book_id) => {
    try {
      let params = {
        TableName: BOOKS_TABLE_NAME,
        Key: {
          "book_id": book_id
        }
      };

      const data = await DynamoDb.get(params).promise();
      if(data.Item != null) 
      {
        let success = {
          timestamp: GetCurrentTime(),
        };
        for (var key in data.Item) {
          if (data.Item.hasOwnProperty(key) && key !== "ttl") {
            success[key] = data.Item[key];
          }
        }    
        return GenerateResponse(200, success);
      } 
      else 
      {
        let success = {
          message : "No Record Found"
        };
        return GenerateResponse(404, success);
      }
    } catch (error) {
      let err  = {
        message: "Unable to read item."
      };
      return GenerateResponse(403, error);           
    }     
  },
  DynamoUpdateBook: async (book_id, bookData) => {

    try {
      var params = {
        TableName: BOOKS_TABLE_NAME,
        Key: {
          'book_id': book_id
        },
        ExpressionAttributeNames: {
          '#book_data': 'book_data'
        },
        ExpressionAttributeValues: {
          ':v_book_data': bookData 
        },
        UpdateExpression: 'set #book_data = :v_book_data',
        ReturnValues: "ALL_NEW"
      };
      const data = await DynamoDb.update(params).promise()
      return GenerateResponse(200, data.Attributes)
    } catch (err) {
      console.log(err)
      let error = {
        message : "Failed to update the pdata"
      };
      return GenerateResponse(400, error);
    }
  }
};


async function InsertBook (bookData) {
  try {
    const expTime = GetCurrentTime() + TTL;
    var uniqyeKey = await GetUniqueKey();
    var params = {
      TableName: BOOKS_TABLE_NAME,
      Item: {
        'book_id': uniqyeKey,
        'book_data': bookData,
        'ttl': expTime
      },
      ConditionExpression: 'attribute_not_exists(book_id)'
    };

    await DynamoDb.put(params).promise();
    let success  = {
      book_id: params.Item.book_id
    };
    return GenerateResponse(200, success);
  } catch (err) {
    console.log(err)
      let error  = {
        message: 'Unable to create'
      };
      return GenerateResponse(400, error);
  }
}

async function GetUniqueKey () {
	var uniqueKey = '';
	var NextLengthOfKey = MIN_KEY_LENGTH ;
	var lengthOfKey = NextLengthOfKey <= MAX_KEY_LENGTH ? NextLengthOfKey : MAX_KEY_LENGTH ;
	for (var i = lengthOfKey; i > 0; --i) uniqueKey += KEY_ALLOWED_CHARACTERS[Math.round(Math.random() * (KEY_ALLOWED_CHARACTERS.length - 1))];

	return uniqueKey;     
}

function GetCurrentTime () {
	let now = new Date();
	return Math.round(now.getTime() / 1000);
}

function GenerateResponse(statusCode, data) {
	let response = {
		statusCode: statusCode,
		data: data
	}	
			
	return response;
}
