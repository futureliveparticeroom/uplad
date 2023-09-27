const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const app = express();
const port = 3002;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('/public/uploads');



});





app.post('/upload', upload.single('video'), (req, res) => {
  res.redirect('success.html');

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const uploadedVideoPath = req.file.path;
  const gifPath = uploadedVideoPath.split('.').slice(0, -1).join('.') + '.webm';

  ffmpeg(uploadedVideoPath)
    .toFormat('webm')
    .on('error', (err) => {
      console.error(err);
      res.redirect('error.html');
    })
    .save(gifPath);
});

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
