import * as fs from 'fs/promises';
import { ICOCData, IRecordTrackingData, ISingerData, IEnvelopeData, INotaryData } from '../types/interfaces';
import { certificateOfCompletion } from '../services/certificateService';

export async function createPDFBuffer(
    filePath: string,
    dynamicData: ICOCData,
    dynamicRTData: IRecordTrackingData,
    singerEvents: ISingerData[],
    envelopeEvents: IEnvelopeData[],
    notaryPublics: INotaryData[]
): Promise<Buffer | undefined> {
    try {
        // Check if file exists
        try {
            await fs.access(filePath);
        } catch (err) {
            console.error(`❌ File not found at path: ${filePath}- ${err}`);
            console.log("Please make sure the PDF file exists in the correct location.");
            return undefined;
        }
        
        // Read the PDF file as a buffer
        const pdfBytes = await fs.readFile(filePath);
        const pdfBuffer = await certificateOfCompletion(
            pdfBytes,
            dynamicData,
            dynamicRTData,
            singerEvents,
            envelopeEvents,
            notaryPublics
        );
        return Buffer.from(pdfBuffer);
    } catch (error) {
        console.error("❌ Error Creating PDF Buffer:", error);
        return undefined;
    }
}
