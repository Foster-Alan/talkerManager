const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionarr
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// GET 
app.get('/talker', async (req, res) => {
  const data = JSON.parse(fs.readFileSync('src/talker.json', 'utf8'));
  res.status(200).json(data);
});

app.listen(PORT, () => {
  console.log('Online');
});
