const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const FileUpload = require('../models/fileupload');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(null, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const fileUpload = new FileUpload({
    _id: new mongoose.Types.ObjectId(),
    fileUploadPath: url + '/images/' + req.file.filename
  });
  fileUpload.save().then(createdFileUpload => {
    res.status(201).json({
      message: 'File upload added successfully!',
      _id: createdFileUpload._id,
      fileUpload: createdFileUpload.fileUploadPath
    });
  });
});

router.get('', (req, res, next) => {
  FileUpload.find().then(fileUploadList => {
    res.status(200).json({
      message: 'File uploads fetched successfully!',
      fileUploadList: fileUploadList
    });
  });
});

router.get('/:id', (req, res, next) => {
  FileUpload.findById(req.params.id).then(fileUpload => {
    if (fileUpload) {
      res.status(200).json(fileUpload);
    } else {
      res.status(404).json({
        message: 'File upload not found!'
      });
    };
  });
});

router.put('/:id', multer({storage: storage}).single('image'), (req, res, next) => {
  let fileUploadPath = req.body.fileUploadPath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    fileUploadPath = url + '/images/' + req.file.filename
  }
  const fileUpload = new FileUpload({
    _id: req.body.id,
    fileUploadPath: fileUploadPath
  });
  FileUpload.updateOne({ _id: req.params.id }, fileUpload).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'File upload updated!'
    });
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'File upload deleted!'
    });
  });
});

module.exports = router;
