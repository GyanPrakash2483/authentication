# Login

## Request

JSON Request
```
    {
        "email": email,
        "password": password
    }
```
JSON Response
```
    {
        "success": true | false,
        "code": Number,
        "token": login_token | null
    }
```

## Codes
|Code  | Meaning                |
|------|------------------------|
|0     |Successful login        |
|1     |User does not exist     |
|2     |Inavalid Credentials    |

## Process
- Send JSON request

endpoint `/auth/login`

```
{
    "email": email,
    "password": password
}
```

- Check if user exists, if doesnt, send JSON response
```
{
    "success": false,
    "code": 1
}
```
- If user exists verify the password with data in database `users`
- If not verified send JSON response
```
    {
        "success": false,
        "code": 2
    }
```

- If verified, generate a corresponding JWT.

- Send JSON response
```
    {
        "sucess": true,
        "code": 0,
        "token": JWT token
    }
```