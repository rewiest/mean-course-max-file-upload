const mongoose = require('mongoose');

const fileUploadSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fileUploadPath: { type: String, require: true }
});

module.exports = mongoose.model('FileUpload', fileUploadSchema);
