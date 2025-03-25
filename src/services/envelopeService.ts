import { EnvelopeData, TextItem } from "../types/interfaces";
import { FIRST_COLUMN_X, SECOND_COLUMN_X, THIRD_COLUMN_X } from "../config/constants";

export const generateEnvelopeUIObjectProperties = async (
    data: EnvelopeData,
    startY: number
  ): Promise<TextItem[]> => {
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