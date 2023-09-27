const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const app = express();
const port = 3002;

app.use(express.static('public')); // 假設您有一個名為 'public' 的目錄包含靜態檔案，例如 'success.html'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const uploadedVideoPath = req.file.path;
  const gifPath = path.join(__dirname,'public', 'videos', Date.now() + '.webm');

  ffmpeg(uploadedVideoPath)
    .toFormat('webm')
    .on('end', () => {
      res.redirect('success.html');
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).redirect('error.html'); // 注意，如果 'end' 事件已經發生，這將引發錯誤
    })
    .save(gifPath);
});

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});