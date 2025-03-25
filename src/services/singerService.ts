import { SingerData, TextItem } from '../types/interfaces';
import { DEFAULT_HIGHLIGHT_COLOR, FIRST_COLUMN_X, SECOND_COLUMN_X, THIRD_COLUMN_X } from '../config/constants';
import { fontService } from './fontService';

export const generateSingerUIObjectProperties = async (
  data: SingerData,
  startY: number,
  spacing: number = 10
): Promise<TextItem[]> => {
  // Get font instances from fontService
  const { font, boldFont } = fontService;

  return [
    {
      text: data.name ?? " ",
      position: { x: FIRST_COLUMN_X, y: startY },
      font: boldFont, // Using bold font for the name
    },
    {
      text: data.email ?? " ",
      position: { x: FIRST_COLUMN_X, y: startY - spacing },
      font: font, // Using regular font for email
    },
    {
      text: data.security ?? " ",
      position: { x: FIRST_COLUMN_X, y: startY - spacing * 2 },
    },
    {
      text: data.subtitle ?? " ",
      position: { x: FIRST_COLUMN_X, y: startY - spacing * 3 },
      font: boldFont,
    },
    {
      text: data.subtitlevalue ?? " ",
      position: { x: FIRST_COLUMN_X, y: startY - spacing * 4 },
      ignoreOverflow: true,
    },
    {
      text: data.signature ?? " ",
      position: { x: SECOND_COLUMN_X, y: startY },
      font: boldFont,
      color: DEFAULT_HIGHLIGHT_COLOR
    },
    {
      text: `using IP address: ${data.ipaddress ?? " "}`,
      position: { x: SECOND_COLUMN_X, y: startY - spacing * 3 }
    },
    {
      text: `Sent: ${data.sent ?? " "}`,
      position: { x: THIRD_COLUMN_X, y: startY }
    },
    {
      text: `Viewed: ${data.viewed ?? " "}`,
      position: { x: THIRD_COLUMN_X, y: startY - spacing * 2 }
    },
    {
      text: `Signed: ${data.signed ?? " "}`,
      position: { x: THIRD_COLUMN_X, y: startY - spacing * 3 }
    }
  ];
};