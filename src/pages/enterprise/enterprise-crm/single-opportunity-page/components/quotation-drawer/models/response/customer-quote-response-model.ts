interface PageDetail {
    pageNumber: number;
    pageElementCount: number;
    totalRecords: number;
}

interface Result {
    resultCode: string;
    resultDescription: string;
    pageDetail: PageDetail;
}

export interface CustomerQuoteModel {
    quoteId: string;
    quoteName: string;
    status: string;
    expiryDate: string;
}

export interface QuoteListModel {
    quoteList: CustomerQuoteModel[];
}

export interface CustomerQuoteResponseDataModel {
    result: Result;
    customerQuoteList: CustomerQuoteModel[];
}

export interface QuoteFormValueModel {
    quoteId?: string;
    quoteName?: string;
  }
