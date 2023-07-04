# simple-crud-api

## Setup

- Use 18 LTS version of Node.js
- Clone this repo
- Go to project directory: `$ cd simple-crud-api`
- Install dependencies: `$ npm i`
- Create `.env` file with `SERVER_PORT=3000` for example
- Start server: `$ npm run start:prod`
- When the server is started, you can send requests to the address `http://localhost:3000/`

## Usage

1. Implemented endpoint `api/users`:
   - **GET** `api/users` is used to get all persons
     - Server answered with `status code` **200** and all users records
   - **GET** `api/users/{userId}`
     - Server answered with `status code` **200** and record with `id === userId` if it exists
     - Server answered with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
     - Server answered with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
   - **POST** `api/users` is used to create record about new user and store it in database
     - Server answered with `status code` **201** and newly created record
     - Server answered with `status code` **400** and corresponding message if request `body` does not contain **required** fields
   - **PUT** `api/users/{userId}` is used to update existing user
     - Server answered with` status code` **200** and updated record
     - Server answered with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
     - Server answered with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
   - **DELETE** `api/users/{userId}` is used to delete existing user from database
     - Server answered with `status code` **204** if the record is found and deleted
     - Server answered with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
     - Server answered with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
2. Users are stored as `objects` that have following properties:
   - `id` — unique identifier (`string`, `uuid`) generated on server side
   - `username` — user's name (`string`, **required**)
   - `age` — user's age (`number`, **required**)
   - `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)
3. For tests, you need restart server, and write `$ npm run test:verbose` command in terminal
