const express = require('express');
const multer = require('multer');

const app = express();
const port = 3002;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('../server/public/img');
});

app.post('/upload', upload.single('video'), (req, res) => {
  res.send('影片上傳成功！');
});

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});