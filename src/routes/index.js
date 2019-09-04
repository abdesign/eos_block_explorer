import express from 'express';
let app = express();

app.get('/', (req, res, next) => {
  res.render('index', { title: 'EOS Explorer' });
});

export default app;
