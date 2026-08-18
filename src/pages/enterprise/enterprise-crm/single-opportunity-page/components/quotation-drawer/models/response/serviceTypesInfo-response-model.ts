export interface ServiceSpecification {
  id: string;
  href: string;
  name: string;
  version: string | null;
  targetServiceSchema: unknown | null;
  "@baseType": string | null;
  "@schemaLocation": string | null;
  "@type": string | null;
  "@referredType": string | null;
}

export interface ServiceType {
  name: string;
  serviceSpecification: ServiceSpecification;
}

export interface ServiceTypesResponseModel {
  serviceTypes: ServiceType[];
}