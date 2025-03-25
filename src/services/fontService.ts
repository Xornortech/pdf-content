import { PDFDocument, PDFFont, StandardFonts } from 'pdf-lib';

class FontService {
    private static instance: FontService;
    private _font: PDFFont | null = null;
    private _boldFont: PDFFont | null = null;

    private constructor() {}

    static getInstance(): FontService {
        if (!FontService.instance) {
            FontService.instance = new FontService();
        }
        return FontService.instance;
    }

    async initialize(pdfDoc: PDFDocument): Promise<void> {
        this._font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        this._boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    }

    get font(): PDFFont {
        if (!this._font) {
            throw new Error('Fonts not initialized. Call initialize before using fonts.');
        }
        return this._font;
    }

    get boldFont(): PDFFont {
        if (!this._boldFont) {
            throw new Error('Fonts not initialized. Call initialize before using fonts.');
        }
        return this._boldFont;
    }
}

export const fontService = FontService.getInstance();
