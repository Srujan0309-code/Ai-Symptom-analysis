const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'text/plain',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, images, and text files are allowed.'));
    }
  },
});

/**
 * Extract readable text from a PDF buffer using pdf-parse.
 * Falls back gracefully if extraction fails.
 */
async function extractPdfText(buffer) {
  try {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    const text = data.text || '';
    // Clean up excessive whitespace/newlines but keep structure
    return text.replace(/\n{3,}/g, '\n\n').trim().substring(0, 12000);
  } catch (err) {
    console.warn('[PDF] Extraction failed:', err.message);
    return null;
  }
}

/**
 * Extract text from image using Gemini Vision (if available).
 */
async function extractImageText(buffer, mimetype, notes) {
  try {
    const { GoogleGenAI } = require('@google/genai');
    if (!process.env.GEMINI_API_KEY) return null;

    const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const base64Data = buffer.toString('base64');

    const response = await gemini.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: 'You are a medical OCR specialist. Extract ALL text, numbers, values, and medical data visible in this medical document/report image. Include all lab values, reference ranges, patient info headers, and any clinical notes. Output the raw extracted text exactly as it appears.',
            },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimetype,
              },
            },
          ],
        },
      ],
    });

    return response.text ? response.text.substring(0, 12000) : null;
  } catch (err) {
    console.warn('[IMAGE OCR] Failed:', err.message);
    return null;
  }
}

// POST /api/reports/analyze
router.post('/analyze', authMiddleware, upload.single('report'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const { mimetype, originalname, buffer } = req.file;
  const notes = req.body.notes || '';

  try {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    let extractedText = '';
    let extractionMethod = 'metadata-only';

    // ── Step 1: Extract actual content based on file type ─────────────────
    if (mimetype === 'text/plain') {
      extractedText = buffer.toString('utf-8').substring(0, 12000);
      extractionMethod = 'text-direct';
    } else if (mimetype === 'application/pdf') {
      const pdfText = await extractPdfText(buffer);
      if (pdfText && pdfText.length > 50) {
        extractedText = pdfText;
        extractionMethod = 'pdf-parse';
      } else {
        // PDF text extraction failed (scanned/image PDF) — use Gemini OCR
        console.log('[REPORT] PDF text empty, trying Gemini OCR...');
        const ocrText = await extractImageText(buffer, 'image/jpeg', notes);
        extractedText = ocrText || '';
        extractionMethod = ocrText ? 'gemini-ocr-fallback' : 'metadata-only';
      }
    } else if (mimetype.startsWith('image/')) {
      // Image report — use Gemini Vision OCR to read the values
      const ocrText = await extractImageText(buffer, mimetype, notes);
      extractedText = ocrText || '';
      extractionMethod = ocrText ? 'gemini-vision-ocr' : 'metadata-only';
    }

    console.log(`[REPORT] Extraction method: ${extractionMethod}, text length: ${extractedText.length}`);

    // ── Step 2: Build content for AI analysis ─────────────────────────────
    let contentToAnalyze = '';

    if (extractedText && extractedText.length > 30) {
      contentToAnalyze = `Medical Report: "${originalname}"
${notes ? `Patient Notes: ${notes}\n` : ''}
--- EXTRACTED REPORT CONTENT ---
${extractedText}
--- END OF REPORT ---`;
    } else {
      // Last resort: metadata-based analysis
      contentToAnalyze = `[MEDICAL DOCUMENT]
Filename: ${originalname}
File Type: ${mimetype}
File Size: ${(buffer.length / 1024).toFixed(1)} KB
Patient Notes: "${notes || 'No additional notes provided'}"

Note: The document content could not be fully extracted (possibly a scanned PDF or image without clear text). 
Please analyze based on the filename context and patient notes, clearly stating which values are assumed vs. extracted.`;
    }

    // ── Step 3: AI Analysis via GROQ ──────────────────────────────────────
    const systemPrompt = `You are MediRoute ReportAI — a specialized medical document analysis system.

Your job is to extract and interpret ALL medical values from the provided report content.

CRITICAL RULES:
1. If you can see ACTUAL values in the report (e.g., "Hemoglobin: 11.2 g/dL"), extract the EXACT value and determine its status (Normal/High/Low/Critical) based on standard reference ranges.
2. NEVER return "Unknown" as a value if the actual number is visible in the extracted text.
3. If a value is genuinely not present in the report, state "Not reported" as the value, NOT "Unknown".
4. For status: use standard ranges — e.g., Hemoglobin Normal: 12-16 g/dL (women), 13.5-17.5 g/dL (men).
5. Always provide a clear overallSummary with specific actionable insights.
6. Set urgencyLevel based on actual findings, not assumed.

Respond ONLY with a valid JSON object:
{
  "reportType": "Specific type (e.g., Complete Blood Count (CBC), Lipid Panel, Thyroid Function Test)",
  "keyFindings": [
    {
      "name": "Parameter name (e.g., Hemoglobin)",
      "value": "ACTUAL extracted value with unit (e.g., 11.2 g/dL) — NEVER leave as Unknown if visible",
      "status": "Normal | High | Low | Critical",
      "explanation": "What this value means clinically and why it matters"
    }
  ],
  "healthConcerns": ["Specific concern based on actual findings"],
  "recommendations": ["Specific, actionable recommendation 1", "Recommendation 2", "Recommendation 3"],
  "urgencyLevel": "Routine | Soon | Urgent | Emergency",
  "specialistReferral": "Specific specialist type or 'None required at this time'",
  "overallSummary": "2-3 sentence plain English summary referencing actual values found",
  "disclaimer": "This AI analysis is for informational purposes only and is NOT a clinical diagnosis. Please consult your healthcare provider for interpretation."
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please analyze this medical report:\n\n${contentToAnalyze}` },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.05,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    let content = chatCompletion.choices[0]?.message?.content || '';
    content = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const analysis = JSON.parse(content);

    // Post-process: replace any remaining "Unknown" values with "Not reported"
    if (analysis.keyFindings) {
      analysis.keyFindings = analysis.keyFindings.map(f => ({
        ...f,
        value: f.value === 'Unknown' ? 'Not reported' : f.value,
        status: f.status === 'Unknown' ? 'Normal' : f.status,
      }));
    }

    res.json({
      success: true,
      fileName: originalname,
      analysis,
      extractionMethod,
      analyzedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[REPORT] Analysis error:', error.message);

    res.json({
      success: true,
      fileName: req.file.originalname,
      analysis: {
        reportType: 'Medical Document',
        keyFindings: [
          {
            name: 'Document received',
            value: 'Uploaded successfully',
            status: 'Normal',
            explanation: 'Your document was received. Please ensure it is a text-readable PDF or clear image for best results.',
          },
        ],
        healthConcerns: [],
        recommendations: [
          'Share this document directly with your healthcare provider for professional interpretation.',
          'For best AI analysis results, upload a text-based PDF (not a scanned image).',
          'Keep all your medical reports organized for easy access.',
        ],
        urgencyLevel: 'Routine',
        specialistReferral: 'General Physician',
        overallSummary: 'The document was uploaded successfully but could not be fully parsed. Please consult your doctor for a detailed interpretation.',
        disclaimer: 'This analysis is generated by AI and is NOT a medical diagnosis. Please consult your healthcare provider.',
      },
      extractionMethod: 'fallback',
      analyzedAt: new Date().toISOString(),
    });
  }
});

router.extractPdfText = extractPdfText;
router.extractImageText = extractImageText;
module.exports = router;
