# Mock Server

## Endpoints

- [`GET /v1/matches`](#get-v1matches)
- [`GET /v1/matches/{matchId}`](#get-v1matchesmatchid)
- [`GET /v1/users/me`](#get-v1usersme)
- [`POST /v3/auth/login`](#post-v3authlogin)
- [`POST /v3/auth/refresh`](#post-v3authrefresh)

### `GET /v1/matches`

Returns a paginated list of matches. See [api-types](../api-types/index.ts) for a detailed type-definition of the `Match` entity.

The response also includes a `Total` header indicating the total amount of available in the API.

**Example request**
```
GET /v1/matches?size=5&page=0
Authorization: Bearer eyJhbGciOiJIUzI1N...
```

**Example responses**

Successful request
```
HTTP/1.1 200 OK
Content-Type: application/json
Total: 23

[
  {
    "matchId": "9aac9261-91c0-4ee5-9be1-804235a27375",
    "courtId": "7a7ff0e4-076f-405b-b1f7-8d41a9b3f6a0",
    "venueId": "85b1d53d-1d8b-47c8-b2cd-06a32c6cf905",
    "sport": "TENNIS",
    "startDate": "2024-01-04T09:00Z",
    "endDate": "2024-01-04T11:00Z",
    "teams": [
      ...
    ]
  },
  ...
]
```

Missing/wrong authorization credentials
```
HTTP/1.1 403 OK
Content-Type: application/json
Total: 23

{ "message": "Missing authorization header" }
```

### `GET /v1/matches/{matchId}`

Returns a paginated list of matches. See [api-types](../api-types/index.ts) for a detailed type-definition of the `Match` entity.

**Example request**
```
GET /v1/matches/9aac9261-91c0-4ee5-9be1-804235a27375
Authorization: Bearer eyJhbGciOiJIUzI1N...
```

**Example responses**

Successful request
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "matchId": "9aac9261-91c0-4ee5-9be1-804235a27375",
  "courtId": "7a7ff0e4-076f-405b-b1f7-8d41a9b3f6a0",
  "venueId": "85b1d53d-1d8b-47c8-b2cd-06a32c6cf905",
  "sport": "TENNIS",
  "startDate": "2024-01-04T09:00Z",
  "endDate": "2024-01-04T11:00Z",
  "teams": [
    ...
  ]
}
```

Missing/wrong authorization credentials
```
HTTP/1.1 403 OK
Content-Type: application/json
Total: 23

{ "message": "Missing authorization header" }
```

### `GET /v1/users/me`

Returns the currently authenticated user information. See [api-types](../api-types/index.ts) for a detailed type-definition of the `User` entity.

**Example request**
```
GET /v1/users/me
Authorization: Bearer eyJhbGciOiJIUzI1N...
```

**Example responses**

Successful request
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "userId": "9aac9261-91c0-4ee5-9be1-804235a27375",
  "email": "alice@test.com",
  "displayName": "Alice Alisson",
  "pictureURL": "https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0",
}
```

Missing/wrong authorization credentials
```
HTTP/1.1 403 OK
Content-Type: application/json
Total: 23

{ "message": "Missing authorization header" }
```


### `POST /v3/auth/login`

Request a new set of tokens (access and refresh) for the user identified by the provided credentials. The returned `authToken` can be used to access the rest of the API for **one hour**. The returned `refreshToken` can be used to create a new `authToken` without requiring user credentials for **7 days**.

**Example request**
```
POST /v3/auth/login
Content-Type: application/json

{
  "email": "some@email.com",
  "password": "...",
}
```

**Example responses**

Successful login
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "accessToken": "eyJhbGciOiJIUzI1N...",
  "accessTokenExpiresAt": "2024-03-04T18:40:09.000Z",
  "refreshToken": "eyJhbGciOiJIUzI1...",
  "refreshTokenExpiresAt": "2024-03-11T17:40:09.000Z"
}
```

Non-registered email
```
HTTP/1.1 401 OK
Content-Type: application/json

{
  "message": "Unknown email"
}
```

Wrong credentials
```
HTTP/1.1 401 OK
Content-Type: application/json

{
  "message": "Wrong password. Maybe try ..."
}
```

### `POST /v3/auth/refresh`

Requests a new `accessToken` with an existing refresh token. The response will include a **new** `accessToken` lasting one hour and **the same** refresh token you passed.

**Example request**
```
POST /v3/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

**Example responses**

Successful token refresh
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "accessToken": "eyJhbGciOiJIUzI1N...",
  "accessTokenExpiresAt": "2024-03-04T19:40:09.000Z",
  "refreshToken": "eyJhbGciOiJIUzI1...",
  "refreshTokenExpiresAt": "2024-03-11T17:40:09.000Z"
}
```

Wrong/expired refresh token
```
HTTP/1.1 401 OK
Content-Type: application/json

{
  "message": "Wrong authorization. Refresh token is expired"
}
```
