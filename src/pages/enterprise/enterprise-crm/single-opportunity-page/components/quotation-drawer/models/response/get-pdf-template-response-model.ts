

export interface PDFTemplateListModel {
    tempId: string;
    tempName: string;
    template: string;
  }
  
  export interface PDFTemplateResponseModel {
    pdfTemplateList: PDFTemplateListModel[];
  }