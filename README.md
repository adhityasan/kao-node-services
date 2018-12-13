# Node Services

Nodejs service for simple Document Content Management System

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install dependencies.

```bash
npm install
```

## Configuration

- Define the "jwtPrivateKey" value in the configuration file
- For development purpose, create .env file in the root folder, contain :
```python
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=27017 # port where mongodb service runs
DB_NAME=kaoservice # your db name
DEBUG=app:startup,app:db
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
