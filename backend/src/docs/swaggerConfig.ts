const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Magic cards',
      version: '1.0.0',
      description:
        'This is a REST API application for the swap of cards.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'JSONPlaceholder',
        url: 'https://jsonplaceholder.typicode.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api'
      },
    ],
  };

const options = {
  swaggerDefinition,
  apis: ['./dist/**/*.js', './src/**/*.ts']

};

export const swaggerSpec = swaggerJSDoc(options);