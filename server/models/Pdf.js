const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: {
    type: Buffer,
    required: true
  },
  contentType: {
    type: String,
    default: 'application/pdf'
  }
});

// Virtual for file URL (if needed)
pdfSchema.virtual('fileUrl').get(function() {
  return `/api/pdfs/${this._id}`;
});

const Pdf = mongoose.model('Pdf', pdfSchema);

module.exports = Pdf; 