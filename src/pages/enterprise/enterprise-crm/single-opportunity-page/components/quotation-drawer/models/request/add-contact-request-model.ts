export interface AddContactRequestModel{
    contactOwner: string;
    title: string;
    account: {
        id: string | undefined;
        href: string | undefined
        name: string | undefined;
    };
    fullName: string;
    designation: string;
    contactMobile: string;
    contactOther: string;
    email: string;
    secondryEmail: string;
}
