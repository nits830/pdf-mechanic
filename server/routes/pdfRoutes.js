const express = require('express');
const router = express.Router();
const multer = require('multer');
const Pdf = require('../models/Pdf');
const auth = require('../middleware/auth');

// Configure multer for PDF uploads
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    if (!file) {
      cb(new Error('No file uploaded'), false);
    } else if (file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files are allowed'), false);
    } else {
      cb(null, true);
    }
  }
}).single('pdf');

// Apply auth middleware to all routes
router.use(auth);

// Upload PDF route
router.post('/upload', (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        // Multer error (e.g., file too large)
        return res.status(400).json({ 
          error: 'File upload error',
          details: err.message 
        });
      } else if (err) {
        // Other errors (e.g., wrong file type)
        return res.status(400).json({ 
          error: err.message 
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file provided' });
      }

      // Create new PDF document
      const pdf = new Pdf({
        filename: req.file.originalname,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        data: req.file.buffer,
        userId: req.userId
      });

      await pdf.save();

      res.status(201).json({
        message: 'PDF uploaded successfully',
        pdf: {
          id: pdf._id,
          filename: pdf.filename,
          originalName: pdf.originalName,
          fileSize: pdf.fileSize,
          uploadDate: pdf.uploadDate,
          fileUrl: pdf.fileUrl
        }
      });
    } catch (error) {
      console.error('PDF upload error:', error);
      res.status(500).json({ 
        error: 'Error uploading PDF file',
        details: error.message 
      });
    }
  });
});

// Get user's PDFs
router.get('/my-pdfs', async (req, res) => {
  try {
    const pdfs = await Pdf.find({ userId: req.userId })
      .select('-data') // Exclude the file data from the response
      .sort({ uploadDate: -1 });

    res.json(pdfs);
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    res.status(500).json({ error: 'Error fetching PDFs' });
  }
});

// Get specific PDF by ID
router.get('/:id', async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    
    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    // Check if user has access to this PDF
    if (pdf.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.set({
      'Content-Type': pdf.contentType,
      'Content-Disposition': `inline; filename="${pdf.filename}"`,
    });

    res.send(pdf.data);
  } catch (error) {
    console.error('Error retrieving PDF:', error);
    res.status(500).json({ error: 'Error retrieving PDF' });
  }
});

// Delete PDF
router.delete('/:id', async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    
    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    // Check if user owns this PDF
    if (pdf.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await pdf.deleteOne();
    res.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    console.error('Error deleting PDF:', error);
    res.status(500).json({ error: 'Error deleting PDF' });
  }
});

module.exports = router; 