const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const linkRoutes = require('./routes/linkRoutes');
const { redirectHandler } = require('./controllers/linkController');

const app = express();

app.use(cors({origin: "*", }));
app.use(express.json());


app.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true, version: '1.0' });
});


app.use('/api/links', linkRoutes);


app.get('/:code', redirectHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TinyLink backend running on port ${PORT}`);
});
