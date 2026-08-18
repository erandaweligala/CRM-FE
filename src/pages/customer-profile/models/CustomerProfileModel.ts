export interface CustomerInfoModel {
    title: string;
    fullName: string;
    birthday: string;
    gender: string;
    preferredName: string;
    nationality: string;
    maritalStatus: string;
    customerStatus: string | null;
    customerExpirationDate: string;
    customerCreatedDate: string;
    customerType: string;
    customerId: string;
}

export interface IdentificationModel {
    identificationType: string;
    identificationId: string;
    expirationPeriod: string | null;
    issuingDate: string | null;
    issuingAuthority: string | null;
    attachments: {
        url: string | null;
        description: string | null;
        type: string | null;
    } | null;
}

export interface ContactDetailsModel {
    preferred: boolean;
    mediumType: "address" | "mobileNumber" | "email";
    characteristic: {
        socialNetworkId: string | null;
        country: string | null;
        emailAddress: string | null;
        phoneNumber: string | null;
        stateOrProvince: string | null;
        city: string | null;
        faxNumber: string | null;
        contactType: string | null;
        postCode: string | null;
        street1: string | null;
        street2: string | null;
    };
}

export interface LanguageModel {
    languageCode: string;
    languageName: string;
    isFavoriteLanguage: boolean;
    listeningProficiency: string;
    readingProficiency: string;
    speakingProficiency: string;
    writingProficiency: string;
}

export interface ExternalReferenceModel {
    type: string; // Allowing dynamic values like "Facebook", "Google", etc.
    url: string;
}

export interface CustomerCharacteristicModel {
    attributeName: string;
    attributeValue: string | null; // To handle nullable values
    attributeType: string;
}

export interface CreditRatingModel {
    creditAgencyName: string | null;
    creditAgencyType: string | null;
    ratingReference: string | null;
    ratingScore: string;
}

export interface HierarchyModel {
    type: string;
    relationshipType: string;
    id: string;
    name: string;
}

export interface OrganizationInfoModel {
    id: string| null;
    nameType: string | null;
    tradingName: string | null;
    isLegalEntity: string;
    isHeadOffice: string;
    organizationType: string | null;
    existsDuring: string | null;
    status: string;
    createDate: string | null;
}

export interface RelatedPartyModel {
    role: string;
    name: string;
    type: string | null;
}
export interface TaxAttachmentModel {
    type: string;
    content: string;
    id: string;
    url: string;
}
export interface TaxExemptionModel {
    validDuration: string;
    taxDefinition: string;
    attachment: TaxAttachmentModel | null;
}
export interface CustomerProfileModel {
    customerType: string;
    organizationInfo: OrganizationInfoModel;
    hierarchies: HierarchyModel[];
    customerInfo: CustomerInfoModel;
    identification: IdentificationModel[];
    contactDetails: ContactDetailsModel[];
    skills: string[];
    language: LanguageModel[];
    externalReference: ExternalReferenceModel[];
    customerCharacteristic: CustomerCharacteristicModel[];
    creditRating: CreditRatingModel[];
    relatedParties: RelatedPartyModel[];
    taxExemptions: TaxExemptionModel [];
}