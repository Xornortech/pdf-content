import { PDFFont } from "pdf-lib";

export interface ITextItem {
  text?: string;
  position: {
    x: number;
    y: number;
  };
  image?: string;
  ignoreOverflow?: boolean;
  lineHeight?: number;
  size?: number;
  font?: PDFFont; // Replace with proper PDFFont type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  color?: any; // Replace with proper Color type
  type?: string;
}


export interface INotaryData {
  name?: string;
  img?: string;
  state?: string;
  county?: string;
  commission?: string;
  notaryid?: string;
  signature?: string;
  ipaddress?: string;
  sent?: string;
  viewed?: string;
  signed?: string;
  expiry?: string;
  proofdate?: string;
  proofyear?: string;
  day?: string;
  month?: string;
  year?: string;
  seal?: string;
  idnumber?: string;
}

export interface ICOCData {
  eId?: string;
  Subject?: string;
  SourceEnvelope?: string;
  documentPages?: number;
  certificatePages?: number;
  autoNav?: string;
  envelopedStamping?: string;
  timeZone?: string;
  signatureCount?: number;
  initialCount?: number;
  cocstatus?: string;
  address?: string;
}

export interface IRecordTrackingData {
  status?: string;
  holder?: string;
  location?: string;
}

export interface ISingerData {
  name?: string;
  email?: string;
  security?: string;
  subtitle?: string;
  subtitlevalue?: string;
  signature?: string;
  ipaddress?: string;
  sent?: string;
  viewed?: string;
  signed?: string;
}

export interface IEnvelopeData {
  envelopeevent?: string;
  status?: string;
  timestamp?: string;
}

export interface IPlacementObject {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface IDimension {
  width: number;
  height: number;
}

export interface IColumnYPositions {
  [key: number]: number;
}

export interface IGroupedItems {
  [key: number]: ITextItem[];
}

export interface ILogoDimensions {
  width: number;
  height: number;
}