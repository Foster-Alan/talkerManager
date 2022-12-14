const express = require('express');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
app.use(express.json());
const { validateEmail } = require('./middlewares/validateEmail');
const { validatePassword } = require('./middlewares/validatePassword');
const { validateAuthentication } = require('./middlewares/validateAuthentication');
const { validateName } = require('./middlewares/validateName');
const { validateAge } = require('./middlewares/validateAge');
const { validateTalk } = require('./middlewares/validateTalk');

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

// POST
app.post('/login', validateEmail, validatePassword, (req, res) => {
  res.status(200).json({ token: crypto.randomBytes(8).toString('hex') });
});

app.post('/talker',
  validateAuthentication, validateName, validateAge, validateTalk,
  (req, res) => {
  const { name, age, talk } = req.body;
  const talkers = JSON.parse(fs.readFileSync('src/talker.json'));

  const addTalker = { id: talkers.length + 1, name, age, talk };

  talkers.push(addTalker);
  fs.writeFileSync('src/talker.json', JSON.stringify(talkers));
  res.status(201).json(addTalker);
});

app.listen(PORT, () => {
  console.log('Online');
});
