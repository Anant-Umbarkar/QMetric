var express = require('express');
var router = express.Router();
const authenticateToken = require('../core/auth/utilities')
let fileController=require("../controllers/fileController");
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExt);
  },
});
const upload = multer({ storage: storage });

router.post('/totext', authenticateToken, upload.single('file'), fileController.convertToText);
router.get('/totext', authenticateToken, fileController.getResults);
// router.get('/totext/:id', authenticateToken, fileController.getResults);
router.get('/all', authenticateToken, fileController.getResultsById);
router.post ('/search', authenticateToken, fileController.searchPapers);

router.get('/test', (req, res) => {
  res.send('File route is working!');
});

module.exports = router;
