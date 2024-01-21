# authentication

#### Submission for SD wing project by:

Gyan Prakash Singh Jaruhar

2023UG1091


## Run your own instance

- clone the repository
```
git clone https://github.com/GyanPrakash2483/authentication.git
```
- Install the dependencies
```
cd authentication
npm install
```

- Set up a mongodb server `authentication` with collections `users`, `userdata`, `userregbuffer`

- Set up `.env` file for environment variables in [docs/envvars](./docs/envvars.md)

- start the mongodb server

- Start the server
```
npm run deploy
```

- Open `localhost:PORT` in the browser.
`PORT` being declared in environment variables.

Use hotmail for email services as gmail requires stricter authentication system which requires extra steps to set up.