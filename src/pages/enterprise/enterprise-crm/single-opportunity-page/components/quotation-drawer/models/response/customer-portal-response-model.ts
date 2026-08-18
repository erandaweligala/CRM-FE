export interface CustomerDetailsResponseModel {
    logedCustomer: {
      customerPin: string|null;
      uniqueIdentity: string|null;
    }|{};
  }

  export interface CustomerQueryParamsModel {
    customerPin?: string|null;
    uniqueIdentity?: string|null;
  }

  export interface QuoteQueryModel {
    customerPin?: string|null;
    uniqueIdentity?: string|null;
    name?: string;
    offset?: number|null;
    limit?: number|null;
    id:string|null
  }
