import { RecordTrackingData, TextItem } from '../types/interfaces';
import { FIRST_COLUMN_X, SECOND_COLUMN_X, THIRD_COLUMN_X } from '../config/constants';


export const generateRecordTrackingUIObjectProperties = async (
  data: RecordTrackingData,
  startY: number
): Promise<TextItem[]> => {
  return [
    {
      text: data.status ?? " ",
      position: { x: FIRST_COLUMN_X, y: startY },
    },
    {
      text: data.holder ?? " ",
      position: { x: SECOND_COLUMN_X, y: startY },
    },
    {
      text: `Location: ${data.location ?? " "}`,
      position: { x: THIRD_COLUMN_X, y: startY },
    },
  ];
};