import { ICOCData, IRecordTrackingData, ISingerData, IEnvelopeData, INotaryData } from '../types/interfaces';

export const dynamicData: ICOCData = {
    eId: "4E7F116F7BD64418B5CF79A581B88FE7",
    Subject: "Please DocuSign: MTP - Complete Agreement -E3.pdf",
    SourceEnvelope: "MTP Financial Services",
    documentPages: 14,
    certificatePages: 4,
    autoNav: "Enabled",
    envelopedStamping: "Enabled",
    timeZone: "(UTC-08:00) Pacific Time (US & Canada)",
    initialCount: 0,
    cocstatus: "Completed",
    address: "\n70 Washington Square South, \nNew York, NY 10012, \nUnited States, \ntest@gmail.com, \nphone no 9216596999",
    signatureCount: 0,
};

export const dynamicRTData: IRecordTrackingData = {
    status: "Original 12/14/2018 11:43:40 AM",
    holder: "MTP Financial Services \nminoritytaxpayer@gmail.com \n",
    location: "DocuSign",
};

export const singerEvents: ISingerData[] = [
    {
        name: "Singer Event 1",
        email: "singer-event-1@email.com",
        security: "Security Level: \n   DocuSign email \n   ID: 1 \n    12/14/2018 11:43:40 AM",        
        subtitle: "Electronic Record and Signature Disclosure:",
        subtitlevalue: " Accepted: 12/14/2018 11:43:40 AM \n ID: 4E7F116F7BD64418B5CF79A581B88FE7",
        signature: "Completed",
        ipaddress: "1.2.3.4",
        sent: "12/14/2018 11:43:40 AM",
        viewed: "12/14/2018 11:43:40 AM",
        signed: "12/14/2018 11:43:40 AM",
    },
    {
        name: "Singer Event 2",
        email: "singer-event-1@email.com",
        security: "Security Level: \n   DocuSign email \n   ID: 1 \n    12/14/2018 11:43:40 AM",        
        subtitle: "Electronic Record and Signature Disclosure:",
        subtitlevalue: " Accepted: 12/14/2018 11:43:40 AM \n ID: 4E7F116F7BD64418B5CF79A581B88FE7",
        signature: "Completed",
        ipaddress: "1.2.3.4",
        sent: "12/14/2018 11:43:40 AM",
        viewed: "12/14/2018 11:43:40 AM",
        signed: "12/14/2018 11:43:40 AM",
    }
];

export const envelopeEvents: IEnvelopeData[] = [
    {
        envelopeevent: "Envelope Event 1",
        status: "Hash/Encrypted",
        timestamp: "12/14/2018 11:43:40 AM",
    },
    {
        envelopeevent: "Envelope Event 2",
        status: "Hash/Encrypted",
        timestamp: "12/14/2018 11:43:40 AM",
    }
];

export const notaryPublics: INotaryData[] = [
    {
        name: "vishal sood",
        img: "./assets/images.png",
        state: "Harrow",
        county: "United Kingdom",
        expiry: "12/14/2018 11:43:40 AM",
        proofdate: "December 29th",
        proofyear: "24",
        day: "26th",
        month: "Feburary",
        year: "25", 
        seal: "./assets/stamp.jpg",
        idnumber: "1234567890000000000",
    },
    {
        name: "vishal",
        img: "./assets/esign_logo.png",
        state: "Harrow",
        county: "UK",
        expiry: "12/14/2018 11:43:40 AM",
        proofdate: "December 29th",
        proofyear: "24",
        day: "3rd",
        month: "Feburary",
        year: "25", 
        seal: "./assets/stamp.jpg",
        idnumber: "1234567890",
    }
];
