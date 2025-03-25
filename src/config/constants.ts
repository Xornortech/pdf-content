/* eslint-disable @typescript-eslint/no-unused-vars */
import { rgb } from 'pdf-lib';
import { Dimension } from '../types/interfaces';

export const PAGE_DIMENSION: Dimension = {
  width: 600,
  height: 800,
};

export const COLUMN_COUNT = 3;
export const MARGINLEFT = 30;
export const MARGINRIGHT = 30;
export const MARGINTOP = 10;

export const COLUMN_WIDTH = (PAGE_DIMENSION.width - (MARGINLEFT + MARGINRIGHT)) / COLUMN_COUNT;
export const FIRST_COLUMN_X = MARGINLEFT + 5;
export const SECOND_COLUMN_X = FIRST_COLUMN_X + COLUMN_WIDTH;
export const THIRD_COLUMN_X = SECOND_COLUMN_X + COLUMN_WIDTH;

export const HEADER_WIDTH = PAGE_DIMENSION.width - (MARGINLEFT + MARGINRIGHT);
export const HEADER_HEIGHT = 14;
export const HEADER_BG_COLOR = rgb(0.8, 0.8, 0.8);
export const HEADER_TEXT_COLOR = rgb(0, 0, 0);
export const HEADER_TEXT_SIZE = 10;

export const DEFAULT_BODY_TEXT_COLOR = rgb(0, 0, 0);
export const DEFAULT_HIGHLIGHT_COLOR = rgb(1, 0, 0);
export const DEFAULT_BODY_TEXT_SIZE = 8;
export const DEFAULT_LINE_HEIGHT = 10;

export const LOGO_DIMENSION: Dimension = {
  width: 100,
  height: 50,
};