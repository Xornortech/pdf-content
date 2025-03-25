import { Router, Request, Response } from 'express';
import path from 'path';
import { createPDFBuffer } from '../utils/pdfUtils';
import { dynamicData, dynamicRTData, singerEvents, envelopeEvents, notaryPublics } from '../data/mockData';

const router = Router();

router.get('/generate-certificate', async (_req: Request, res: Response): Promise<void> => {
    try {
        const pdfPath = path.resolve(__dirname, '../templates/karm-2024.pdf');
        const pdfBuffer = await createPDFBuffer(
            pdfPath,
            dynamicData,
            dynamicRTData,
            singerEvents,
            envelopeEvents,
            notaryPublics
        );
        
        if (!pdfBuffer) {
            res.status(500).json({ error: 'Failed to generate PDF' });
            return;
        }

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');
        
        // Send the PDF buffer
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
