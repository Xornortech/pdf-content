/* eslint-disable @typescript-eslint/no-unused-vars */

import { PDFDocument, PDFPage, PDFFont, rgb } from 'pdf-lib';
import * as fs from 'fs/promises';
import path from 'path';
import { TextItem, PlacementObject, ColumnYPositions, GroupedItems } from '../types/interfaces';
import {
  DEFAULT_LINE_HEIGHT,
  DEFAULT_BODY_TEXT_COLOR,
  COLUMN_WIDTH, 
  DEFAULT_BODY_TEXT_SIZE,
  HEADER_BG_COLOR,
  HEADER_TEXT_COLOR,
  HEADER_TEXT_SIZE,
} from '../config/constants';

import { fontService } from './fontService';



export const addHeaderBG = async (page: PDFPage, placementObject: PlacementObject) => {
  page.drawRectangle({
    x: placementObject.x,
    y: placementObject.y,
    width: placementObject.width!,
    height: placementObject.height!,
    color: HEADER_BG_COLOR,
  });
};

export const addHeaderText = async (
  page: PDFPage,
  text: string,
  placementObject: PlacementObject
) => {
  const { boldFont } = fontService;
  page.drawText(text, {
    x: placementObject.x,
    y: placementObject.y,
    size: HEADER_TEXT_SIZE,
    color: HEADER_TEXT_COLOR,
    font: boldFont,
  });
};

export const embedImage = async (
  pdfDoc: PDFDocument, 
  page: PDFPage, 
  imagePath: string, 
  x: number, 
  y: number, 
  fit_width: number, 
  fit_height: number
) => {
  const imgPath = path.resolve(__dirname, imagePath);
  try {
    await fs.access(imgPath);
    const imgBytes = await fs.readFile(imgPath);
    let image;
    
    if (imagePath.endsWith('.png')) {
      image = await pdfDoc.embedPng(imgBytes);
    } else if (imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg')) {
      image = await pdfDoc.embedJpg(imgBytes);
    } else {
      console.error('❌ Unsupported image format. Only PNG and JPG/JPEG are supported.');
      return;
    }

    const { width, height } = image.scale(1);
    const scaleFactor = Math.min(fit_width / width, fit_height / height);
    
    page.drawImage(image, {
      x,
      y: y - (height * scaleFactor),
      width: width * scaleFactor,
      height: height * scaleFactor,
    });
  } catch (error) {
    console.error(`❌ Image not found at path: ${imgPath} - ${error}`);
  }
};

export const drawWrappedText = async (
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
) => {
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
        page.drawText(line, {
          x,
          y: lastY - yOffset - extraSpacing,
          size,
          color,
          font,
        });
        line = word + " ";
        yOffset += lineHeight + extraSpacing;
      } else {
        line = testLine;
      }
    }

      page.drawText(line, {
        x,
        y: lastY - yOffset - extraSpacing,
        size,
        color,
        font,
      });
      yOffset += lineHeight + extraSpacing;
    }

  lastY = lastY - yOffset;
  return lastY;
};

export const groupItemsByColumn = async (
  pdfDoc: PDFDocument,
  page: PDFPage,
    populatedArray: TextItem[],
  startY: number,
    splitIntoColumns: 2 | 3
): Promise<number> => {
  const {fon}
  const groupedItems: GroupedItems = {};
    // Group items by x position
    for (const item of populatedArray) {
        if (!groupedItems[item.position.x]) {
            groupedItems[item.position.x] = [];
  }
        groupedItems[item.position.x].push(item);
    }     
    const sortedColumns = Object.keys(groupedItems).map(Number).sort((a, b) => a - b);   
    // Track Y position for each column
    const columnYPositions: ColumnYPositions = {};
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
                await embedImage(pdfDoc, page, item.image, x, newY, 60, 60);
            } else if(splitIntoColumns === 3) {
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
        }
        // Update lowest Y position for this column
        columnYPositions[x] = Math.min(columnYPositions[x], newY);
  }

  return Math.min(...Object.values(columnYPositions));
};

