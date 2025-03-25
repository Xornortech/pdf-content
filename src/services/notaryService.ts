import path from 'path';
import { NotaryData, TextItem } from '../types/interfaces';
import { FIRST_COLUMN_X, DEFAULT_BODY_TEXT_SIZE } from '../config/constants';
import { fontService } from './fontService';

export const generateNotaryUIObjectProperties = async (
    data: NotaryData,
    startY: number,
    extraspace: number = 10,
    spacing: number = 10
  ): Promise<TextItem[]> => {
    const { font, boldFont } = fontService;

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
    ];
  };
