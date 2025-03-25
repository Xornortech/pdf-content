/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import * as fs from "fs/promises";
import path from "path";
import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage, PDFImage } from 'pdf-lib';
import {
    ICOCData,
    IRecordTrackingData,
    ISingerData,
    IEnvelopeData,
    INotaryData,
    ITextItem,
    IDimension, 
    IPlacementObject,
    IGroupedItems,
    IColumnYPositions,
    ILogoDimensions
} from "./types/interfaces";

// This is a mockdData for testing. Remove this before using in main code.
import { dynamicData, dynamicRTData, singerEvents, envelopeEvents, notaryPublics } from './data/mockData';
// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Global variables
let font: PDFFont;
let boldFont: PDFFont;

const PAGE_DIMENSION: IDimension = {
  width: 600,
  height: 800,
};
const COLUMN_COUNT = 3;
const MARGINLEFT = 30;
const MARGINRIGHT = 30;
const MARGINTOP = 10;
const COLUMN_WIDTH =
  (PAGE_DIMENSION.width - (MARGINLEFT + MARGINRIGHT)) / COLUMN_COUNT;
const FIRST_COLUMN_X = MARGINLEFT + 5;
const SECOND_COLUMN_X = FIRST_COLUMN_X + COLUMN_WIDTH;
const THIRD_COLUMN_X = SECOND_COLUMN_X + COLUMN_WIDTH;

const HEADER_WIDTH = PAGE_DIMENSION.width - (MARGINLEFT + MARGINRIGHT);
const HEADER_HEIGHT = 14;
const HEADER_BG_COLOR = rgb(0.8, 0.8, 0.8);
const HEADER_TEXT_COLOR = rgb(0, 0, 0);
const HEADER_TEXT_SIZE = 10;

const DEFAULT_BODY_TEXT_COLOR = rgb(0, 0, 0);
const DEFAULT_HIGHLIGHT_COLOR = rgb(1, 0, 0);
const DEFAULT_BODY_TEXT_SIZE = 8;
const DEFAULT_LINE_HEIGHT = 10;

const LOGO_DIMENSION: IDimension = {
  width: 100,
  height: 50,
};

//#region "UI Object Properties"
/**
 * 
 * @param data IRecordTrackingData
 * @param startY number
 * @returns ITextItem[]
 */
const generateRecordTrackingUIObjectProperties = async (
  data: IRecordTrackingData,
  startY: number,
): Promise<ITextItem[]> => {
  return [
    {
      text: `status: ${data.status}`,
      position: { x: FIRST_COLUMN_X, y: startY },
    },
    {
      text: `Holder: ${data.holder}`,
      position: { x: SECOND_COLUMN_X, y: startY },
    },
    {
      text: `Location: ${data.location}`,
      position: { x: THIRD_COLUMN_X, y: startY },
    },
  ];
};
/**
 * 
 * @param data ICOCData
 * @param startY number
 * @param spacing number
 * @returns ITextItem[]
 */
const generateCocUIObjectProperties = async (
  data: ICOCData,
  startY: number,
  spacing: number = 10
): Promise<ITextItem[]> => {
  return [
    { text: `Envelope ID: ${data.eId}`, position: { x: FIRST_COLUMN_X, y: startY } },
    { text: `Subject: ${data.Subject}`, position: { x: FIRST_COLUMN_X, y: startY - spacing * 1 } },
    { text: `Source Envelope: ${data.SourceEnvelope}`, position: { x: FIRST_COLUMN_X, y: startY - spacing * 2 } },
    { text: `Document Pages: ${data.documentPages}`, position: { x: FIRST_COLUMN_X, y: startY - spacing * 3 } },
    { text: `Certificate Pages: ${data.certificatePages}`, position: { x: FIRST_COLUMN_X, y: startY - spacing * 4 } },
    { text: `AutoNav: ${data.autoNav}`, position: { x: FIRST_COLUMN_X, y: startY - spacing * 5 } },
    { text: `Enveloped Stamping: ${data.envelopedStamping}`, position: { x: FIRST_COLUMN_X, y: startY - spacing * 6 } },
    { text: `Time Zone: ${data.timeZone}`, position: { x: FIRST_COLUMN_X, y: startY - spacing * 7 } },
    { text: `Signatures: ${data.signatureCount}`, position: { x: SECOND_COLUMN_X, y: startY - spacing * 4 }},
    { text: `Initials: ${data.initialCount}`, position: { x: SECOND_COLUMN_X, y: startY - spacing * 5 }},
    { text: `Status: ${data.cocstatus}`, position: { x: THIRD_COLUMN_X, y: startY } },
    { text: `Envelope Originator: ${data.address}`, position: { x: THIRD_COLUMN_X, y: startY - spacing * 4 } },
  ];
}
/**
 * 
 * @param data ISingerData
 * @param startY number
 * @param spacing number
 * @returns ITextItem[]
 */
const generateSingerUIObjectProperties = async (
  data: ISingerData,
  startY: number,
  spacing: number = 10
): Promise<ITextItem[]> => {
  return [
    { 
      text: data.name ?? '', 
      position: { x: FIRST_COLUMN_X, y: startY } 
    },
    {
      text: data.email ?? '',
      position: { x: FIRST_COLUMN_X, y: startY - spacing }
    },
    {
      text: data.security ?? '',
      position: { x: FIRST_COLUMN_X, y: startY - spacing * 2 }
    },
    {
      text: data.subtitle ?? '',
      position: { x: FIRST_COLUMN_X, y: startY - spacing * 3 }
    },
    {
      text: data.subtitlevalue ?? '',
      position: { x: FIRST_COLUMN_X, y: startY - spacing * 4 }
    },
    {
      text: data.signature ?? '',
      position: { x: SECOND_COLUMN_X, y: startY },
      font: boldFont,
      color: DEFAULT_HIGHLIGHT_COLOR
    },
    {
      text: `using IP address: ${data.ipaddress ?? ''}`,
      position: { x: SECOND_COLUMN_X, y: startY - spacing * 3 }
    },
    { 
      text: `Sent: ${data.sent ?? ''}`, 
      position: { x: THIRD_COLUMN_X, y: startY } 
    },
    {
      text: `Viewed: ${data.viewed ?? ''}`,
      position: { x: THIRD_COLUMN_X, y: startY - spacing * 2 }
    },
    {
      text: `Signed: ${data.signed ?? ''}`,
      position: { x: THIRD_COLUMN_X, y: startY - spacing * 3 }
    }
  ];
};
/**
 * 
 * @param data IEnvelopeData
 * @param startY number
 * @returns ITextItem[]
 */
const generateEnvelopeUIObjectProperties = async (
  data: IEnvelopeData,
  startY: number
): Promise<ITextItem[]> => {
  return [
    {
      text: data.envelopeevent ?? '',
      position: { x: FIRST_COLUMN_X, y: startY }
    },
    { 
      text: data.status ?? '', 
      position: { x: SECOND_COLUMN_X, y: startY } 
    },
    { 
      text: data.timestamp ?? '', 
      position: { x: THIRD_COLUMN_X, y: startY } 
    }
  ];
};
/**
 * 
 * @param data INotaryData
 * @param startY number
 * @param extraspace number
 * @param spacing number
 * @returns ITextItem[]
 */
const generateNotaryUIObjectProperties = async (
  data: INotaryData,
  startY: number,
  extraspace: number = 10,
  spacing: number = 10
): Promise<ITextItem[]> => {
  const initialText = "Witness my signature and official seal.";
  const stateText = "Notary Public in and for the STATE OF ";
  const blankSpace = "_______________";
  const smallBlankSpace = "______";
  const stateVariable = data.state ?? " ";
  const initialWidth = boldFont.widthOfTextAtSize(initialText, DEFAULT_BODY_TEXT_SIZE);
  const stateWidth = font.widthOfTextAtSize(stateText, DEFAULT_BODY_TEXT_SIZE);
  const blankspacewidth = font.widthOfTextAtSize(blankSpace, DEFAULT_BODY_TEXT_SIZE);
  const smallBlankspacewidth = font.widthOfTextAtSize(smallBlankSpace, DEFAULT_BODY_TEXT_SIZE);
  const stateVariableWidth = boldFont.widthOfTextAtSize(stateVariable, DEFAULT_BODY_TEXT_SIZE);
  let stateStartPt = 0;
  if (blankspacewidth > stateVariableWidth) {
    stateStartPt = blankspacewidth / 2 - stateVariableWidth / 2;
  }

  const countyText = "COUNTY OF ";
  const countryVariable = data.county ?? " ";
  const countyWidth = font.widthOfTextAtSize(countyText, DEFAULT_BODY_TEXT_SIZE);
  const countryVariableWidth = boldFont.widthOfTextAtSize(countryVariable, DEFAULT_BODY_TEXT_SIZE);
  let countyStartPt = 20;
  if (blankspacewidth > countryVariableWidth) {
    countyStartPt = blankspacewidth / 2 - countryVariableWidth / 2;
  }
  const countryVariableStartPt = FIRST_COLUMN_X + countyStartPt + countyWidth + 6;

  const dayText = "ON this ";
  const dayWidth = font.widthOfTextAtSize(dayText, DEFAULT_BODY_TEXT_SIZE);
  const dayVariable = data.day ?? " ";
  const dayVariableWidth = boldFont.widthOfTextAtSize(dayVariable, DEFAULT_BODY_TEXT_SIZE);
  let dayStartPt = 20;
  if (smallBlankspacewidth > dayVariableWidth) {
    dayStartPt = smallBlankspacewidth / 2 - dayVariableWidth / 2;
  }
  const dayTextPosition = countryVariableStartPt + (blankspacewidth > countryVariableWidth ? blankspacewidth : countryVariableWidth) + 6;
  const blankSpacePosition = dayTextPosition + dayWidth + 2;
  const dayVariableStartPt = dayTextPosition + dayWidth + dayStartPt;

  const dayOfText = " day of ";
  const dayOfWidth = font.widthOfTextAtSize(dayOfText, DEFAULT_BODY_TEXT_SIZE);
  const dayOfVariable = data.month ?? " ";
  const dayOfVariableWidth = boldFont.widthOfTextAtSize(dayOfVariable, DEFAULT_BODY_TEXT_SIZE);
  let dayOfStartPt = 20;
  if (blankspacewidth > dayOfVariableWidth) {
    dayOfStartPt = blankspacewidth / 2 - dayOfVariableWidth / 2;
  }

  const dayOfTextPosition = blankSpacePosition + (smallBlankspacewidth > dayVariableWidth ? smallBlankspacewidth : dayVariableWidth) + 2;
  const dayOfBlankSpacePosition = dayOfTextPosition + dayOfWidth + 2;
  const dayOfVariableStartPt = dayOfTextPosition + dayOfWidth + dayOfStartPt;

  const yearText = ", 20";
  const yearWidth = font.widthOfTextAtSize(yearText, DEFAULT_BODY_TEXT_SIZE);
  const yearVariable = data.year ?? " ";
  const yearVariableWidth = boldFont.widthOfTextAtSize(yearVariable, DEFAULT_BODY_TEXT_SIZE);
  let yearStartPt = 20;
  if (smallBlankspacewidth > yearVariableWidth) {
    yearStartPt = smallBlankspacewidth / 2 - yearVariableWidth / 2;
  }
  const yearTextPosition = dayOfBlankSpacePosition + (blankspacewidth > yearVariableWidth ? blankspacewidth : yearVariableWidth) + 2;
  const yearBlankSpacePosition = yearTextPosition + yearWidth + 2;
  const yearVariableStartPt = yearTextPosition + yearWidth + yearStartPt;

  return [
    {
      text: "Witness my signature and official seal.",
      position: { x: FIRST_COLUMN_X + extraspace, y: startY },
      ignoreOverflow: true,
      font: boldFont,
    },
    {
      text: stateText,
      position: { x: FIRST_COLUMN_X + initialWidth + 8, y: startY },
      ignoreOverflow: true,
    },
    {
      text: blankSpace,
      position: {
        x: FIRST_COLUMN_X + initialWidth + stateWidth + 8,
        y: startY,
      },
      ignoreOverflow: true,
    },
    {
      text: stateVariable,
      position: {
        x: FIRST_COLUMN_X + initialWidth + stateWidth + stateStartPt,
        y: startY,
      },
      ignoreOverflow: true,
      font: boldFont,
    },
    {
      text: countyText,
      position: { x: FIRST_COLUMN_X + extraspace, y: startY - spacing },
      ignoreOverflow: true,
    },
    {
      text: blankSpace,
      position: { x: FIRST_COLUMN_X + countyWidth + 8, y: startY - spacing },
      ignoreOverflow: true,
    },
    {
      text: countryVariable,
      position: { x: countryVariableStartPt, y: startY - spacing },
      ignoreOverflow: true,
      font: boldFont,
    },
    {
      text: dayText,
      position: { x: dayTextPosition, y: startY - spacing },
      ignoreOverflow: true,
    },
    {
      text: smallBlankSpace,
      position: { x: blankSpacePosition, y: startY - spacing },
      ignoreOverflow: true,
    },
    {
      text: dayVariable,
      position: { x: dayVariableStartPt, y: startY - spacing },
      ignoreOverflow: true,
      font: boldFont,
    },
    {
      text: dayOfText,
      position: { x: dayOfTextPosition, y: startY - spacing },
      ignoreOverflow: true,
    },
    {
      text: blankSpace,
      position: { x: dayOfBlankSpacePosition, y: startY - spacing },
      ignoreOverflow: true,
    },
    {
      text: dayOfVariable,
      position: { x: dayOfVariableStartPt, y: startY - spacing },
      ignoreOverflow: true,
      font: boldFont,
    },
    {
      text: yearText,
      position: { x: yearTextPosition, y: startY - spacing },
      ignoreOverflow: true,
    },
    {
      text: smallBlankSpace,
      position: { x: yearBlankSpacePosition, y: startY - spacing },
      ignoreOverflow: true,
    },
    {
      text: yearVariable,
      position: { x: yearVariableStartPt, y: startY - spacing },
      ignoreOverflow: true,
      font: boldFont,
    },
    {
      text: "the applicant, who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to this application, appeared before me, and did personally sign the application.",
      position: { x: FIRST_COLUMN_X + extraspace, y: startY - spacing * 2 },
      ignoreOverflow: true,
    },
    {
      text: "",
      position: { x: FIRST_COLUMN_X + extraspace, y: startY - spacing * 4 },
      ignoreOverflow: true,
      lineHeight: 3,
    },
    {
      text: "Signature of Notary Public             My commission expires",
      position: { x: FIRST_COLUMN_X + extraspace, y: startY - spacing * 5 },
      ignoreOverflow: true,
    },
    {
      text: "",
      position: { x: FIRST_COLUMN_X + extraspace, y: startY - spacing * 6 },
      ignoreOverflow: true,
      lineHeight: 3,
    },
    {
      text: "Electronically signed and notarized online using the Proof platform.",
      position: { x: FIRST_COLUMN_X + extraspace, y: startY - spacing * 7 },
      size: DEFAULT_BODY_TEXT_SIZE + 1,
      ignoreOverflow: true,
    },
    {
      text: "",
      position: { x: FIRST_COLUMN_X + extraspace, y: startY - spacing * 8 },
      ignoreOverflow: true,
      lineHeight: 3,
    },
    {
      text: blankSpace,
      position: { x: FIRST_COLUMN_X + extraspace, y: startY - spacing * 9 },
      ignoreOverflow: true,
    },
    {
      text: blankSpace,
      position: { x: blankspacewidth, y: startY - spacing * 9 },
      ignoreOverflow: true,
    },
    {
      text: blankSpace,
      position: { x: blankspacewidth * 2, y: startY - spacing * 9 },
      ignoreOverflow: true,
    },
    {
      text: blankSpace,
      position: { x: blankspacewidth * 3 + 4, y: startY - spacing * 9 },
      ignoreOverflow: true,
    },
    {
      text: blankSpace,
      position: { x: blankspacewidth * 4 + 4, y: startY - spacing * 9 },
      ignoreOverflow: true,
    },
    {
      text: ",",
      position: { x: blankspacewidth * 5 + 4, y: startY - spacing * 9 },
      ignoreOverflow: true,
    },
    {
      text: smallBlankSpace,
      position: { x: blankspacewidth * 5 + 8, y: startY - spacing * 9 },
      ignoreOverflow: true,
    },
    ...(data.img ? [{
      image: path.resolve(__dirname, data.img),
      position: { x: FIRST_COLUMN_X + 15, y: startY - spacing * 9 },
      ignoreOverflow: true,
      type: "sign"
    }] : []),
    {
      text: data.name ?? " ",
      position: { x: blankspacewidth * 2 + 10, y: startY - spacing * 9 },
      ignoreOverflow: true,
      font: boldFont,
    },
    {
      text: data.proofdate ?? " ",
      position: { x: blankspacewidth * 3 + 6, y: startY - spacing * 9 },
      ignoreOverflow: true,
      font: boldFont,
    },
    {
      text: data.proofyear ?? " ",
      position: { x: blankspacewidth * 5 + 8, y: startY - spacing * 9 },
      ignoreOverflow: true,
      font: boldFont,
    },
    {
      text:  "Official Seal: ",
      position: { x: THIRD_COLUMN_X + 8, y: startY - 1 },
      ignoreOverflow: true,
      font: font,
      size: 10,

    },
    {
        image: data.seal ?? "",
        position: { x: THIRD_COLUMN_X + 18, y: startY - spacing * 4.5 },
        ignoreOverflow: true,
        type: "seal"
    },
    {
        text:  `${data.name ?? ""}`,
        position: { x: THIRD_COLUMN_X + 83, y: startY - spacing * 3.3 },
        ignoreOverflow: true,
        font: boldFont,
        size: 6,
  
    },
    {
        text:  `ID Number`,
        position: { x: THIRD_COLUMN_X + 103, y: startY - spacing * 4.6 },
        ignoreOverflow: true,
        font: boldFont,
        size: 6,  
    },
    {
        text:  `${data.idnumber ?? 0}`,
        position: { 
            x: THIRD_COLUMN_X + 108 - (data.idnumber ? data.idnumber.length : 0), 
            y: startY - spacing * 5.2 
        },
        ignoreOverflow: true,
        font: font,
        size: 5,  
    },
    {
        text:  `COMMISSION EXPIRES`,
        position: { 
            x: THIRD_COLUMN_X + 108 - 17, 
            y: startY - spacing * 5.9
        },
        ignoreOverflow: true,
        font: boldFont,
        size: 6,  
    },
    {
        text:  `${data.expiry ?? 0}`,
        position: { 
            x: THIRD_COLUMN_X + 110 - (data.expiry ? (data.expiry.length) : 0), 
            y: startY - spacing * 6.5
        },
        ignoreOverflow: true,
        font: font,
        size: 5,  
    }
  ];
};
//#endregion "UI Object Properties"

/**
 * 
 * @param page PDFPage
 * @param logoImage PDFImage
 * @param logoDims ILogoDimensions
 */
const addLogo = async (page: PDFPage, logoImage: PDFImage, logoDims: ILogoDimensions): Promise<void> => {
    const { width, height } = logoDims;
    // Define header size
    const headerHeight = LOGO_DIMENSION.height; // Fixed height for header section
    const maxWidth = LOGO_DIMENSION.width; // Max width for logo in header
    // Scale logo to fit within the header
    const scaleFactor = Math.min(maxWidth / width, headerHeight / height);
    const scaledWidth = width * scaleFactor;
    const scaledHeight = height * scaleFactor;
    // Center logo in the header
    const xPosition = HEADER_WIDTH - scaledWidth / 2; // Left padding
    const yPosition = PAGE_DIMENSION.height - headerHeight / 2 - scaledHeight / 2; // Center vertically in header
    // Draw the logo
    page.drawImage(logoImage, {
      x: xPosition,
      y: yPosition,
      width: scaledWidth,
      height: scaledHeight,
    });
};
/**
 * 
 * @param page PDFPage
 * @param placementObject IPlacementObject
 */
const addHeaderBG = async (page: PDFPage, placementObject: IPlacementObject) => {
    page.drawRectangle({
        x: placementObject.x,
        y: placementObject.y,
        width: placementObject.width!,
        height: placementObject.height!,
        color: HEADER_BG_COLOR,
    });
};
/**
 * 
 * @param page PDFPage
 * @param text string
 * @param placementObject IPlacementObject
 */
const addHeaderText = async (page: PDFPage, text: string, placementObject: IPlacementObject) => {
    page.drawText(text, {
      x: placementObject.x,
      y: placementObject.y,
      size: HEADER_TEXT_SIZE,
      color: HEADER_TEXT_COLOR,
      font: boldFont,
    });
};
/**
 * 
 * @param page PDFPage
 * @param text string
 * @param x number
 * @param y number
 * @param maxWidth number
 * @param extraSpacing number
 * @param lineHeight number
 * @param size number
 * @param color ReturnType<typeof rgb>
 * @param font PDFFont
 * @returns Promise<number>
 */
const drawWrappedText = async (
    page: PDFPage,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    extraSpacing: number,
    lineHeight: number,
    size: number,
    color: ReturnType<typeof rgb>,
    font: PDFFont
): Promise<number> => {
    const lines = text.split("\n");
    let yOffset = 0;
    let lastY = y;
  
    for (const lineText of lines) {
      const words = lineText.split(" ");
      let line = "";
      for (const word of words) {
        const testLine = line + word + " ";
        const textWidth = font.widthOfTextAtSize(testLine, size);
  
        if (textWidth > maxWidth && line.length > 0) {
          page.drawText(line, { x, y: lastY - yOffset - extraSpacing, size, color, font});
          line = word + " ";
          yOffset += lineHeight + extraSpacing;
        } else {
          line = testLine;
        }
      }  
      page.drawText(line, { x, y: lastY - yOffset - extraSpacing, size, color, font });
      yOffset += lineHeight + extraSpacing;
    }  
    lastY = lastY - yOffset;
    return lastY;
};
/**
 * 
 * @param pdfDoc PDFDocument
 * @param page PDFPage
 * @param imagePath string
 * @param x number
 * @param y number
 * @param fit_width number
 * @param fit_height number
 * @returns 
 */
const embedImage  = async (pdfDoc: PDFDocument, page: PDFPage, imagePath: string, x: number, y: number, fit_width: number, fit_height: number) => {
    const imgPath   = path.resolve(__dirname, imagePath);
    try {
        await fs.access(imgPath);
    } catch (error) {
        console.error(`Logo file not found at ${imgPath} ${error}`);
        return;
    }
    const imgBytes = await fs.readFile(imgPath);
    let imgImage;
    if(imgPath.endsWith('.png')) {
        imgImage = await pdfDoc.embedPng(imgBytes);
    } else if (imgPath.endsWith('.jpg') || imgPath.endsWith('.jpeg')) {
        imgImage = await pdfDoc.embedJpg(imgBytes);
    } else {
        console.error('❌ Unsupported image format. Only PNG and JPG/JPEG are supported.');
        return;
    }
    
    const imgDims = imgImage.scale(0.2);
    const { width, height } = imgDims;
    // Define header size
    const headerHeight = fit_height; // Fixed height for header section
    const maxWidth = fit_width; // Max width for logo in header

    // Scale logo to fit within the header
    const scaleFactor = Math.min(maxWidth / width, headerHeight / height);
    const scaledWidth = width * scaleFactor;
    const scaledHeight = height * scaleFactor;
    // Center logo in the header
    const xPosition = x; // Left padding
    const yPosition = y - scaledHeight/2; // Center vertically in header
    // Draw the logo
    page.drawImage(imgImage, {
        x: xPosition,
        y: yPosition,
        width: scaledWidth,
        height: scaledHeight,
    });    
}
/**
 * 
 * @param pdfDoc PDFDocument
 * @param page PDFPage
 * @param populatedArray ITextItem[]
 * @param lastY number
 * @param splitIntoColumns 2 | 3
 * @returns Promise<number>
 */
const groupItemsByColumn = async ( pdfDoc: PDFDocument, page: PDFPage, populatedArray: ITextItem[], lastY: number, splitIntoColumns: 2 | 3): Promise<number> => {    
    const groupedItems: IGroupedItems = {};     
    // Group items by x position
    for (const item of populatedArray) {
        if (!groupedItems[item.position.x]) {
            groupedItems[item.position.x] = [];
        }
        groupedItems[item.position.x].push(item);
    }          
    const sortedColumns = Object.keys(groupedItems).map(Number).sort((a, b) => a - b);    
    // Track Y position for each column
    const columnYPositions: IColumnYPositions = {};
    sortedColumns.forEach(x => {
        columnYPositions[x] = Math.max(...groupedItems[x].map(item => item.position.y));
    });    
    // Loop through columns and draw text
    for (const x of sortedColumns) {
        let newY = columnYPositions[x];
        for (const item of groupedItems[x]) {
            const extraSpacing = 0;
            if (item.ignoreOverflow) {
                newY = item.position.y;
            }            
            if (item.image) {
                if(item.image.trim().length > 0) {
                    if(item.type === "sign") {
                        await embedImage(pdfDoc, page, item.image, x, newY, 50, 50);
                    } else if (item.type === "seal") {
                        await embedImage(pdfDoc, page, item.image, x, newY, 60, 60);
                    } else {
                        await embedImage(pdfDoc, page, item.image, x, newY, 55, 55);
                    }                    
                }
            } else if (splitIntoColumns === 3) {
                newY = await drawWrappedText(
                    page,
                    item.text ?? " ",
                    x,
                    newY,
                    COLUMN_WIDTH,
                    extraSpacing,
                    item.lineHeight ?? DEFAULT_LINE_HEIGHT,
                    item.size ?? DEFAULT_BODY_TEXT_SIZE,
                    item.color ?? DEFAULT_BODY_TEXT_COLOR,
                    item.font ?? font
                );
            } else if (splitIntoColumns === 2) {
                if (x >= COLUMN_WIDTH * 2) {
                    newY = await drawWrappedText(
                        page,
                        item.text ?? " ",
                        x,
                        newY,
                        COLUMN_WIDTH,
                        extraSpacing,
                        item.lineHeight ?? DEFAULT_LINE_HEIGHT,
                        item.size ?? DEFAULT_BODY_TEXT_SIZE,
                        item.color ?? DEFAULT_BODY_TEXT_COLOR,
                        item.font ?? font
                    );
                } else {
                    newY = await drawWrappedText(
                        page,
                        item.text ?? " ",
                        x,
                        newY,
                        COLUMN_WIDTH * 2,
                        extraSpacing,
                        item.lineHeight ?? DEFAULT_LINE_HEIGHT,
                        item.size ?? DEFAULT_BODY_TEXT_SIZE,
                        item.color ?? DEFAULT_BODY_TEXT_COLOR,
                        item.font ?? font
                    );
                }
            } else {
                newY = await drawWrappedText(
                    page,
                    item.text ?? " ",
                    x,
                    newY,
                    COLUMN_WIDTH * 3,
                    extraSpacing,
                    item.lineHeight ?? DEFAULT_LINE_HEIGHT,
                    item.size ?? DEFAULT_BODY_TEXT_SIZE,
                    item.color ?? DEFAULT_BODY_TEXT_COLOR,
                    item.font ?? font
                );
            }            
            // Update lowest Y position for this column
            columnYPositions[x] = Math.min(columnYPositions[x], newY);
        }
    }
    return Math.min(...Object.values(columnYPositions));
};
/**
 * Creates a certificate PDF based on the provided buffer and dynamic data.
 * 
 * @param pdfBuffer The buffer containing the PDF template.
 * @param cocDynamicData The dynamic data for the Certificate of Completion.
 * @param RTDynamicData The dynamic data for the Record Tracking.
 * @param singerEventsDynamicData The dynamic data for the Singer Events.
 * @param envelopeEventsDynamicData The dynamic data for the Envelope Events.
 * @param notaryEventDynamicData The dynamic data for the Notary Events.
 * @returns The PDF buffer with the certificate.
 */
const certificatePDF = async (pdfBuffer: Buffer, cocDynamicData: ICOCData | undefined, RTDynamicData: IRecordTrackingData | undefined, singerEventsDynamicData: ISingerData[] | undefined, envelopeEventsDynamicData: IEnvelopeData[] | undefined, notaryEventDynamicData: INotaryData[] | undefined): Promise<Uint8Array> => {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.addPage([PAGE_DIMENSION.width, PAGE_DIMENSION.height]);
    
    const logoPath = path.resolve(__dirname, './assets/esign_logo.png');
    try {
        await fs.access(logoPath);
    } catch (error) {
        throw new Error(`Logo file not found at ${logoPath} - ${error}`);
    }
    const logoBytes = await fs.readFile(logoPath);
    let logoImage;
    if(logoPath.endsWith('.png')) {
        logoImage = await pdfDoc.embedPng(logoBytes);
    } else if (logoPath.endsWith('.jpg') || logoPath.endsWith('.jpeg')) {
        logoImage = await pdfDoc.embedJpg(logoBytes);
    } else {
        throw new Error('❌ Unsupported image format. Only PNG and JPG/JPEG are supported.');
    }
    const logoDims = logoImage.scale(0.03);
    // Embed logo
    await addLogo(page, logoImage, logoDims);
    let startY = PAGE_DIMENSION.height - MARGINTOP - LOGO_DIMENSION.height;
    let lastY = startY;
    
    if (cocDynamicData) {
        // Process the array with actual values
        await addHeaderBG(page, { x: FIRST_COLUMN_X, y: startY, width: HEADER_WIDTH, height: HEADER_HEIGHT });
        await addHeaderText(page, "Certificate of Completion", { x: FIRST_COLUMN_X, y: startY + 3 });
        startY = startY - HEADER_HEIGHT;
        const populatedArray = await generateCocUIObjectProperties(cocDynamicData, startY);
        lastY = await groupItemsByColumn(pdfDoc, page, populatedArray, lastY, 2);  
        lastY = lastY - HEADER_HEIGHT;        
    }
    
    if (RTDynamicData) {
        await addHeaderBG(page, { x: FIRST_COLUMN_X, y: lastY, width: HEADER_WIDTH, height: HEADER_HEIGHT });
        await addHeaderText(page, "Record Tracking", { x: FIRST_COLUMN_X, y: lastY + 3 });
        lastY = lastY - HEADER_HEIGHT;
        const populatedArray = await generateRecordTrackingUIObjectProperties(RTDynamicData, lastY);                 
        lastY = await groupItemsByColumn(pdfDoc, page, populatedArray, lastY, 3);
    }
    
    if (singerEventsDynamicData) {
        await addHeaderBG(page, { x: FIRST_COLUMN_X, y: lastY, width: HEADER_WIDTH, height: HEADER_HEIGHT });
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
        await addHeaderBG(page, { x: FIRST_COLUMN_X, y: lastY, width: HEADER_WIDTH, height: HEADER_HEIGHT });
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
        await addHeaderBG(page, { x: FIRST_COLUMN_X, y: lastY, width: HEADER_WIDTH, height: HEADER_HEIGHT });
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
            const height = lastY - initialY;
            const sealRectX = Number(THIRD_COLUMN_X + extraSpaceAroundRect + 12);
            const sealRectY = initialY + height/4;
            const sealrectWidth = COLUMN_WIDTH - (2 * (extraSpaceAroundRect + 10));
            const sealrectHeight = height/2;

            page.drawRectangle({
                x: sealRectX,
                y: sealRectY,
                width: sealrectWidth,
                height: sealrectHeight,
                borderColor: rgb(0.4, 0.4, 0.4),
                borderWidth: 1
            })
            page.drawLine({
                start: { x: sealRectX + 65, y: sealRectY - 20 },
                end: { x: sealRectX + sealrectWidth - 5, y: sealRectY - 20 },
                thickness: 1,
                color: rgb(0.4, 0.4, 0.4)
            })
            lastY = lastY - DEFAULT_LINE_HEIGHT;
        }
    }
    
    // Save PDF
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile('./docusign_certificate.pdf', pdfBytes);
    return pdfBytes;
};





async function createPDFBuffer(filePath: string, dynamicData: ICOCData, dynamicRTData: IRecordTrackingData, singerEvents: ISingerData[], envelopeEvents: IEnvelopeData[], notaryPublics: INotaryData[]) {
    try {
        const absolutePath = path.resolve(__dirname, filePath);
        // Check if file exists
        try {
            await fs.access(absolutePath);
        } catch (err) {
            console.error(`❌ File not found at path: ${absolutePath}`);
            console.log("Please make sure the PDF file exists in the correct location.");
            return;
        }
        
        // Read the PDF file as a buffer
        const pdfBytes = await fs.readFile(absolutePath);
        const pdfBuffer = await certificatePDF(pdfBytes, dynamicData, dynamicRTData, singerEvents, envelopeEvents, notaryPublics);
        return pdfBuffer; // Return the buffer for further processing
    } catch (error) {
        console.error("❌ Error Creating PDF Buffer:", error);
    }
}

// Now use the test PDF
createPDFBuffer('karm-2024.pdf', dynamicData, dynamicRTData, singerEvents, envelopeEvents, notaryPublics);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
