export interface EmailModel {
  sendDate: string;
  subject: string;
  id?: string;
  referenceType: string;
  referenceId?: string;
  createdBy: string;
  status: string;
  emailType: string;
  emailBody: string;
  blindCarbonCopy: string;
  carbonCopy: string;
  sendTo:string;
}
