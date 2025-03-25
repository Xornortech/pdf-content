import { COCData, TextItem } from '../types/interfaces';
import { FIRST_COLUMN_X, SECOND_COLUMN_X, THIRD_COLUMN_X } from '../config/constants';
import { fontService } from './fontService';

export const generateCOCUIObjectProperties = async (
  data: COCData,
  startY: number,
  spacing: number = 10
): Promise<TextItem[]> => {
  // Get font instances from fontService
  const { boldFont } = fontService;

  return [
    { 
      text: `Envelope ID: ${data.eId}`, 
      position: { x: FIRST_COLUMN_X, y: startY }, 
      font: boldFont 
    },
    { 
      text: `Subject: ${data.Subject}`, 
      position: { x: FIRST_COLUMN_X, y: startY - spacing * 1 } 
    },
    { 
      text: `Source Envelope: ${data.SourceEnvelope}`, 
      position: { x: FIRST_COLUMN_X, y: startY - spacing * 2 } 
    },
    { 
      text: `Document Pages: ${data.documentPages}`, 
      position: { x: FIRST_COLUMN_X, y: startY - spacing * 3 } 
    },
    { 
      text: `Certificate Pages: ${data.certificatePages}`, 
      position: { x: FIRST_COLUMN_X, y: startY - spacing * 4 } 
    },
    { 
      text: `AutoNav: ${data.autoNav}`, 
      position: { x: FIRST_COLUMN_X, y: startY - spacing * 5 } 
    },
    { 
      text: `Enveloped Stamping: ${data.envelopedStamping}`, 
      position: { x: FIRST_COLUMN_X, y: startY - spacing * 6 } 
    },
    { 
      text: `Time Zone: ${data.timeZone}`, 
      position: { x: FIRST_COLUMN_X, y: startY - spacing * 7 } 
    },
    { 
      text: `Signatures: ${data.signatureCount}`, 
      position: { x: SECOND_COLUMN_X, y: startY - spacing * 4 } 
    },
    { 
      text: `Initials: ${data.initialCount}`, 
      position: { x: SECOND_COLUMN_X, y: startY - spacing * 5 } 
    },
    { 
      text: `Status: ${data.cocstatus}`, 
      position: { x: THIRD_COLUMN_X, y: startY } 
    },
    { 
      text: `Envelope Originator: ${data.address}`, 
      position: { x: THIRD_COLUMN_X, y: startY - spacing * 4 } 
    },
  ];
};