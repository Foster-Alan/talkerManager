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

// GET
app.get('/talker/:id', async (req, res) => {
  const arr = JSON.parse(fs.readFileSync('src/talker.json', 'utf8'));
  const obj = arr.find((param) => param.id === Number(req.params.id));

  if (obj) return res.status(200).json(obj);
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.listen(PORT, () => {
  console.log('Online');
});
