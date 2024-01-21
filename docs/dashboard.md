# Dashboard

JSON request

```
    {
        "JWT": jwt,
        "code": Number,
        "newsecret": "new secret" | null
    }
```

| Code   | Meaning                  |
|--------|--------------------------|
| 0      | Request user info        |
| 1      | Request change in secret |

JSON response

```
    {
        success: true | false,
        code: Number,
        username: username | null,
        email: email | null,
        secret: secret | null
    }
```



## process - Get user info

### Codes

|Code  | Meaning                         |
|------|---------------------------------|
|0     | Successfully received user info |
|1     | Could not verify JWT            |
|2     | Could not obtain user info      |

- Send JSON request

endpoint: `user/userinfo`
```
    {
        "JWT": jwt,
        "code": 0
    }
```

- Verify jwt.

- If unsuccessfull, send JSON response
```
    {
        "sucess": false,
        "code": 1
    }
```

- If verified, get userdata from database `userdata`

- If unsuccessfull, send JSON response
```
    {
        "success": false,
        "code": 2
    }
```

- If successfull, send JSON response
```
    {
        "success": true,
        "code": 0,
        "username": username,
        "email": email,
        "secret": secret
    }
```

## Process - Change secret

### Codes
| Code  | Meaning                      |
|-------|------------------------------|
| 0     | Successfully changed secret  |
| 1     | Could not verify JWT token   |
| 2     | Could not change secret      |

- Send JSON request

endpoint: `user/userinfo`
```
    {
        "JWT": jwt,
        "code": 1,
        "newsecret": new secret
    }
```

- Verify JWT

- If not verified, send JSON response
```
    {
        "success": false,
        "code": 1
    }
```

- If verified, update secret to the new secret

- If not updated, send JSON response

```
    {
        "success": false,
        "code": 2
    }
```

- If updated, send JSON response
```
    {
        "success": true,
        "code": 0
    }
```

## Process - Logout

- Remove `login_token` from `localStorage`
- Refresh / Redirect