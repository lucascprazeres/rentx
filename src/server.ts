import express from 'express';

const app = express();

app.get('/', (request, response) => {
  return response.send('Hello, World!');
});

export default app;