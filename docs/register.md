# Registration

### Required fields
- username
- email
- password

### Response
JSON response
```
    {
        "success": "true" | "false",
        "code": Number
    }

```

### Codes

| Code | Meaning                        |
|------|--------------------------------|
|0     |Successful Signup               |
|1     |Invalid request                 |
|2     |User Already Exists             |
|3     |OTP sent                        |
|4     |Unauthorised access of resource |
|5     |OTP verification failed         |

## Process

- Receive JSON request

endpoint: `/auth/register`

```
    {
        "username": username,
        "email": email,
        "password": password
    }
```
- Check if request is valid, if invalid send a JSON response
```
    {
        "sucess": false,
        "code": 1
    }
```
- Check if user already exists, if does, send JSON response
```
    {
        "success": false,
        "code": 2
    }
```
- If user does not exist
    - Store username, email, hashed password, salt and OTP in database `userregbuffer`
    - Send an email to the user
    ```
    Dear <username>,

    Thankyou for registering, your OTP for verification is <OTP>.
    Regards,
    <Authentication Implementation>
    ```
    - Send JSON response to user
    ```
        {
            "success" true,
            "code": 3
        }
    ```

- Receive JSON request
    
    endpoint: `/auth/otpverify`
    
    ```
    {
        "email": email,
        "password": password,
        "OTP": OTP
    }
    ```
- Verify password with password_hash, if not verified, send JSON response.
```
    {
        "success": false,
        "code": 4
    }
```
- Verify OTP with OTP in `userdata` if not match, send JSON response
```
    {
        "success": false,
        "code": 5
    }
```

- If matches, store email, password hash and salt in database `users`
- Store Email, Username and Secret`(default: 'Not Set')` in database `userdata`

- Send JSON response
```
    {
        "success": true,
        "code": 0
    }
```