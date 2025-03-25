import { PDFDocument, rgb } from 'pdf-lib';
import * as fs from 'fs/promises';
import path from 'path';
import { fontService } from './fontService';

import { 
  ICOCData, 
  IRecordTrackingData, 
  ISingerData, 
  IEnvelopeData, 
  INotaryData, 
  IPlacementObject, 
  IGroupedItems, 
  IColumnYPositions 
} from '../types/interfaces';
import { 
  PAGE_DIMENSION, 
  MARGINTOP, 
  LOGO_DIMENSION, 
  FIRST_COLUMN_X, 
  HEADER_WIDTH, 
  HEADER_HEIGHT,
  SECOND_COLUMN_X,
  THIRD_COLUMN_X,
  DEFAULT_LINE_HEIGHT 
} from '../config/constants';
import { 
  groupItemsByColumn, 
  addHeaderBG, 
  addHeaderText, 
  embedImage 
} from './pdfService';

import { generateNotaryUIObjectProperties } from './notaryService';
import { generateCOCUIObjectProperties } from './cocService';
import { generateRecordTrackingUIObjectProperties } from './RTService';
import { generateSingerUIObjectProperties } from './singerService';
import { generateEnvelopeUIObjectProperties } from './envelopeService';


export const certificateOfCompletion = async (
  pdfBuffer: Buffer,
  cocDynamicData: COCData | undefined,
  RTDynamicData: RecordTrackingData | undefined,
  singerEventsDynamicData: SingerData[] | undefined,
  envelopeEventsDynamicData: EnvelopeData[] | undefined,
  notaryEventDynamicData: NotaryData[] | undefined
): Promise<Uint8Array> => {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  
  // Initialize fonts
  await fontService.initialize(pdfDoc);
  
  // Add a new page
  const page = pdfDoc.addPage([PAGE_DIMENSION.width, PAGE_DIMENSION.height]);
  
  // Add logo
  const logoPath = path.resolve(__dirname, '../assets/esign_logo.png');
  try {
    await fs.access(logoPath);
    await embedImage(
      pdfDoc, 
      page, 
      logoPath, 
      FIRST_COLUMN_X, 
      PAGE_DIMENSION.height - MARGINTOP, 
      LOGO_DIMENSION.width, 
      LOGO_DIMENSION.height
    );
  } catch (error) {
    console.error(`❌ Logo not found at path: ${logoPath} - ${error}`);
    console.log("Please make sure the logo exists in the assets directory.");
  }
  
  let startY = PAGE_DIMENSION.height - MARGINTOP - LOGO_DIMENSION.height;
  let lastY = startY;
  
  if (cocDynamicData) {
    const headerPlacement: PlacementObject = { 
      x: FIRST_COLUMN_X, 
      y: startY, 
      width: HEADER_WIDTH, 
      height: HEADER_HEIGHT 
    };
    await addHeaderBG(page, headerPlacement);
    await addHeaderText(page, "Certificate of Completion", { x: FIRST_COLUMN_X, y: startY + 3 });
    startY = startY - HEADER_HEIGHT;
    const populatedArray = await generateCOCUIObjectProperties(cocDynamicData, startY);
    lastY = await groupItemsByColumn(pdfDoc, page, populatedArray, lastY, 2);  
    lastY = lastY - HEADER_HEIGHT;        
  }
  
  if (RTDynamicData) {
    const headerPlacement: PlacementObject = { 
      x: FIRST_COLUMN_X, 
      y: lastY, 
      width: HEADER_WIDTH, 
      height: HEADER_HEIGHT 
    };
    await addHeaderBG(page, headerPlacement);
    await addHeaderText(page, "Record Tracking", { x: FIRST_COLUMN_X, y: lastY + 3 });
    lastY = lastY - HEADER_HEIGHT;
    const populatedArray = await generateRecordTrackingUIObjectProperties(RTDynamicData, lastY);                 
    lastY = await groupItemsByColumn(pdfDoc, page, populatedArray, lastY, 3);
  }
  
  if (singerEventsDynamicData) {
    const headerPlacement: PlacementObject = { 
      x: FIRST_COLUMN_X, 
      y: lastY, 
      width: HEADER_WIDTH, 
      height: HEADER_HEIGHT 
    };
    await addHeaderBG(page, headerPlacement);
    await addHeaderText(page, "Singer Events", { x: FIRST_COLUMN_X, y: lastY + 3 });
    await addHeaderText(page, "Signature", { x: SECOND_COLUMN_X, y: lastY + 3 });
    await addHeaderText(page, "TimeStamp", { x: THIRD_COLUMN_X, y: lastY + 3 });
    lastY = lastY - HEADER_HEIGHT;
    for (const singerEvent of singerEventsDynamicData) {        
      const populatedArray = await generateSingerUIObjectProperties(singerEvent, lastY);
      lastY = await groupItemsByColumn(pdfDoc, page, populatedArray, lastY, 3);
      lastY = lastY - 8;
    }
    lastY = lastY - DEFAULT_LINE_HEIGHT;
  }
  
  if (envelopeEventsDynamicData) {
    const headerPlacement: PlacementObject = { 
      x: FIRST_COLUMN_X, 
      y: lastY, 
      width: HEADER_WIDTH, 
      height: HEADER_HEIGHT 
    };
    await addHeaderBG(page, headerPlacement);
    await addHeaderText(page, "Envelope Summary Events", { x: FIRST_COLUMN_X, y: lastY + 3 });
    await addHeaderText(page, "Status", { x: SECOND_COLUMN_X, y: lastY + 3 });
    await addHeaderText(page, "TimeStamp", { x: THIRD_COLUMN_X, y: lastY + 3 });
    lastY = lastY - HEADER_HEIGHT;
    for (const envelopeEvent of envelopeEventsDynamicData) {        
      const populatedArray = await generateEnvelopeUIObjectProperties(envelopeEvent, lastY);
      lastY = await groupItemsByColumn(pdfDoc, page, populatedArray, lastY, 3);
    }
    lastY = lastY - DEFAULT_LINE_HEIGHT;
  }
  
  if (notaryEventDynamicData) {
    const headerPlacement: PlacementObject = { 
      x: FIRST_COLUMN_X, 
      y: lastY, 
      width: HEADER_WIDTH, 
      height: HEADER_HEIGHT 
    };
    await addHeaderBG(page, headerPlacement);
    await addHeaderText(page, "Notary Events", { x: FIRST_COLUMN_X, y: lastY + 3 });
    await addHeaderText(page, "Signature", { x: SECOND_COLUMN_X, y: lastY + 3 });
    await addHeaderText(page, "TimeStamp", { x: THIRD_COLUMN_X, y: lastY + 3 }); 
    const extraSpaceAroundRect = 5;   
    lastY = lastY - HEADER_HEIGHT;

    for (const notaryPublic of notaryEventDynamicData) {
      const initialY = lastY + extraSpaceAroundRect;
      const populatedArray = await generateNotaryUIObjectProperties(notaryPublic, lastY - extraSpaceAroundRect, extraSpaceAroundRect);
      lastY = await groupItemsByColumn(pdfDoc, page, populatedArray, lastY, 2);
      page.drawRectangle({ 
        x: FIRST_COLUMN_X, 
        y: initialY, 
        width: HEADER_WIDTH, 
        height: lastY - initialY, 
        borderColor: rgb(0, 0, 0),
        borderWidth: 1  
      });
      page.drawLine({
        start: { x: Number(THIRD_COLUMN_X + extraSpaceAroundRect), y: initialY },
        end: { x: Number(THIRD_COLUMN_X + extraSpaceAroundRect), y: lastY },
        thickness: 1,
        color: rgb(0, 0, 0)
      });
      lastY = lastY - DEFAULT_LINE_HEIGHT;
    }
  }
  
  // Save PDF
  const pdfBytes = await pdfDoc.save();
  await fs.writeFile('./docusign_certificate.pdf', pdfBytes);
  return pdfBytes;
};
