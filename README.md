
# NodeJS Task




## Tech Stack


**Server:** Node, Express, MySQL, Clever Cloud and Heroku.

**Major libraries:** jsonwebtoken, multer. 


## API Reference

#### Fetch the count of how many patients are registered for each psychiatrist in a hospital.

```bash
  GET /api/fetchDetails
```


#### Fetching all the patients in an order for a single psychiatrist after setting Headers.

```bash
  GET /api/fetchPatients
```

| Key | Value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required** For authenticating Psychiatrist |


#### Register Patient (Headers required).

```bash
  POST /api/registerPatient
```


#### Register Psychiatrist.

```bash
  POST /api/registerPsy
```



## Installation and Deployment

It is already deployed on Heroku. If you want to deploy it locally, then follow the below steps.

To deploy this project locally, first clone the repository.

```bash
  git clone https://github.com/Ankur6702/Ankur_NodejsTask.git
```

Install Node modules

```bash
  npm install
```

Now enter the connectionURL in db.js and JWT_SECRET in middleware/fetchUser.js and routes/registerPsy.js


Start the server

```bash
  nodemon index.js
```
