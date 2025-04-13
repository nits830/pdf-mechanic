const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Pdf = require('../models/Pdf');
const auth = require('../middleware/auth');

// Configure multer for PDF uploads (in-memory storage)
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
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

// Extract text from PDF buffer
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Upload and extract text route
router.post('/extract', async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
          error: 'File upload error',
          details: err.message 
        });
      } else if (err) {
        return res.status(400).json({ 
          error: err.message 
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file provided' });
      }

      // Extract text directly
      const extractedText = await extractTextFromPDF(req.file.buffer);

      // Return the extracted text
      res.json({
        filename: req.file.originalname,
        fileSize: req.file.size,
        text: extractedText
      });

    } catch (error) {
      console.error('PDF processing error:', error);
      res.status(500).json({ 
        error: 'Error processing PDF file',
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

// Get extracted text from PDF
router.get('/:id/text', async (req, res) => {
  try {
    const pdf = await Pdf.findOne({ 
      _id: req.params.id,
      userId: req.userId 
    }).select('extractedText textExtractionStatus filename');

    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    if (pdf.textExtractionStatus === 'pending') {
      return res.status(202).json({ 
        status: 'pending',
        message: 'Text extraction is still in progress' 
      });
    }

    if (pdf.textExtractionStatus === 'failed') {
      return res.status(500).json({ 
        status: 'failed',
        message: 'Text extraction failed for this PDF' 
      });
    }

    res.json({
      filename: pdf.filename,
      status: pdf.textExtractionStatus,
      text: pdf.extractedText
    });
  } catch (error) {
    console.error('Error retrieving PDF text:', error);
    res.status(500).json({ 
      error: 'Error retrieving PDF text',
      details: error.message 
    });
  }
});

// Re-run text extraction
router.post('/:id/extract', async (req, res) => {
  try {
    const pdf = await Pdf.findOne({ 
      _id: req.params.id,
      userId: req.userId 
    });

    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    pdf.textExtractionStatus = 'pending';
    await pdf.save();

    // Extract text
    extractTextFromPDF(pdf.data)
      .then(async (extractedText) => {
        pdf.extractedText = extractedText;
        pdf.textExtractionStatus = 'completed';
        await pdf.save();
      })
      .catch(async (error) => {
        console.error('Text extraction error:', error);
        pdf.textExtractionStatus = 'failed';
        await pdf.save();
      });

    res.json({
      message: 'Text extraction started',
      status: 'pending'
    });
  } catch (error) {
    console.error('Error starting text extraction:', error);
    res.status(500).json({ 
      error: 'Error starting text extraction',
      details: error.message 
    });
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