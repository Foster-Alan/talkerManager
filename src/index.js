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
const talkerjson = 'src/talker.json';

// não remova esse endpoint, e para o avaliador funcionarr
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// GET 
app.get('/talker', async (req, res) => {
  const data = JSON.parse(fs.readFileSync(talkerjson, 'utf8'));
  res.status(200).json(data);
});

// GET
app.get('/talker/:id', async (req, res) => {
  const arr = JSON.parse(fs.readFileSync(talkerjson, 'utf8'));
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
  const talkers = JSON.parse(fs.readFileSync(talkerjson));

  const addTalker = { id: talkers.length + 1, name, age, talk };

  talkers.push(addTalker);
  fs.writeFileSync(talkerjson, JSON.stringify(talkers));
  res.status(201).json(addTalker);
});

app.put('/talker/:id',
  validateAuthentication,
  validateName, validateAge, validateTalk,
  (req, res) => {
  const id = Number(req.params.id);
  const talkers = JSON.parse(fs.readFileSync(talkerjson));

  talkers.filter((e) => e.id !== id);
  const update = { id, ...req.body };

  talkers.push(update);
  fs.writeFileSync(talkerjson, JSON.stringify(talkers));

  console.log(talkers);
  res.status(200).json(update);
});

// DELETE /talker/:id
app.delete('/talker/:id',
  validateAuthentication,
  (req, res) => {
  const id = Number(req.params.id);
  const talkers = JSON.parse(fs.readFileSync(talkerjson));

  const newArr = talkers.filter((e) => e.id !== id);
  fs.writeFileSync(talkerjson, JSON.stringify(newArr));
  res.status(204).json();
});

app.listen(PORT, () => {
  console.log('Online');
});
