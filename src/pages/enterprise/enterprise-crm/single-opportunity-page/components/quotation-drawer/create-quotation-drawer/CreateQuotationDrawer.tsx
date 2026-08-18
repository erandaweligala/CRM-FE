import {useState} from "react";
import {
    Button,
    Drawer, Form
} from "antd";
import CreateQuotationDrawerContent from "./components/CreateQuotationDrawerContent";
import {
    contractMethodOptions,
    GenerateContractedPriceOptions} from "./models/request/create-quotation-select-options";
import {OrganizationalCustomer} from "../models/organization-list-response-model";
import {IndividualCustomer} from "../models/customer-data-response-model";
import {createQuote} from "../services/quotation-create.service";
import CreateQuoteResponseModel from "../models/response/create-quote-response-model";
import showNotification from "../../../../../../../services/notification.service";
import {SinglePriceBook} from "../models/response/view_price_book_list_response_model";
import { OpportunityListModel } from "../models/response/opportunity-list-response-model";
import dayjs from "dayjs";
import { BSS_SquareButton as BssSquareButton } from "bss-component-library";
import CreateQuoteRequestModel from "../models/request/create-quote-request-model";

interface QuotationDrawerProps {
    isOpenCreateDrawer: boolean;
    setIsCreateOpenDrawer: (val: boolean) => void;
    entityDetails:{
        accountDetails?: OrganizationalCustomer;
        contactDetails?: IndividualCustomer;
        dealDetails?: OpportunityListModel;
    };
}

const CreateQuotationDrawer = ({
                                   isOpenCreateDrawer,
                                   setIsCreateOpenDrawer,
                                   entityDetails: {
                                       accountDetails: filteredAccount,
                                       contactDetails: filteredContact,
                                       dealDetails: filteredOpportunity,
                                   },
                               }: QuotationDrawerProps) => {
    const [quoteInfoForm] = Form.useForm();
    const [contactInfoForm] = Form.useForm();
    const [billingInfoForm] = Form.useForm();
    const [pricingDefaultsForm] = Form.useForm();
    const [selectedPrimaryQuote, setSelectedPrimaryQuote] = useState<{
        label: string,
        value: string,
    }>()
    const [searchPriceBookList, setSearchPriceBookList] = useState<SinglePriceBook[]>([]);

    const [selectedPriceBook, setSelectedPriceBook] = useState<{
        label: string,
        value: string,
    }>()
    const convertSelectOptionsToSubmitObject = (optionList: {
        label: string;
        value: string;
    }[], selectedValue: string) => {
        const selectedOption = optionList.find((option) => option.value = selectedValue);
        return {
            id: selectedOption?.value,
            name: selectedOption?.label
        }
    }

    function backToInitialStateCreateQuotationDrawer() {
        setSelectedPrimaryQuote(undefined);
        quoteInfoForm.resetFields();
        contactInfoForm.resetFields();
        billingInfoForm.resetFields();
        pricingDefaultsForm.resetFields();
        setSelectedPriceBook(undefined);
    }

    const handleSubmit = async () => {
        try {
            // Validate quoteInfoForm
            const validationPromises = [
                quoteInfoForm.validateFields(),
                contactInfoForm.validateFields(),
                billingInfoForm.validateFields(),
                pricingDefaultsForm.validateFields(),
            ];

            const [quoteInfoFormData, contractInfoFormData, billingInfoFormData] = await Promise.all(validationPromises);
            if (contractInfoFormData.startDate > contractInfoFormData.endDate) {
                showNotification("WARNING", "Start date should be less than end date.");
                return;
            }
            const createQuoteRequestParams: CreateQuoteRequestModel = {
                organization: {
                    id: filteredAccount?.id,
                    href: filteredAccount?.href,
                    name: filteredAccount?.name,
                    role: filteredAccount?.roleName,
                    type: filteredAccount?.type,
                    baseType: filteredAccount?.baseType,
                },
                quoteInfo: {
                    quoteName: quoteInfoFormData.quoteName,
                    isSecondary: quoteInfoFormData.isSecondary,
                    quotePrimaryRef: {
                        quoteId: selectedPrimaryQuote?.value,
                        quoteName: selectedPrimaryQuote?.label,
                    },
                    status: 'Draft',
                    expireOn: quoteInfoFormData.ExpiresOn ? (quoteInfoFormData.ExpiresOn as dayjs.Dayjs).format('YYYY-MM-DDTHH:mm:ss') : '',
                    opportunity: {
                        oppId: filteredOpportunity?.id,
                        oppName: filteredOpportunity?.name,
                    },
                    amt: quoteInfoFormData.amount,
                    currency: quoteInfoFormData.currency,
                    primaryContact: {
                        id: filteredContact?.id,
                        href: filteredContact?.href,
                        name: filteredContact?.givenName,
                        role: filteredContact?.role,
                        type: filteredContact?.type,
                        baseType: filteredContact?.baseType,
                    },
                    owner: filteredOpportunity?.owner ?? '',
                    serviceType: {
                        id: quoteInfoFormData.serviceType.id,
                        name: quoteInfoFormData.serviceType.name,
                    },
                },
                contractInfo: {
                    startDate: contractInfoFormData.startDate ? (contractInfoFormData.startDate as dayjs.Dayjs).format('YYYY-MM-DDTHH:mm:ss') : '',
                    endDate: contractInfoFormData.endDate ? (contractInfoFormData.endDate as dayjs.Dayjs).format('YYYY-MM-DDTHH:mm:ss') : '',
                    subscriptionTerm: contractInfoFormData.subscriptionTermYears + " Years " + contractInfoFormData.subscriptionTermMonths + " Months " + contractInfoFormData.subscriptionTermDays + " Days ",
                    contractMethod: convertSelectOptionsToSubmitObject(contractMethodOptions, contractInfoFormData.contractMethod),
                    contractPrice: convertSelectOptionsToSubmitObject(GenerateContractedPriceOptions, contractInfoFormData.generateContractPrice),
                    terminationDate: contractInfoFormData.terminationDate ? (contractInfoFormData.terminationDate as dayjs.Dayjs).format('YYYY-MM-DDTHH:mm:ss') : '',
                },
                billingInfo: {
                    billingFrequency: {
                        id: billingInfoFormData.billingFrequency,
                        name: billingInfoFormData.billingFrequency,
                    },
                    billStartDate:billingInfoFormData.billStartDate
                },
                priceBook: {
                    id: selectedPriceBook?.value,
                    name: selectedPriceBook?.label.split(" - ")[1]?.trim(),
                },
            };
            const createQuoteResponse: CreateQuoteResponseModel = await createQuote(createQuoteRequestParams);
            console.log("Create Quote Response: ", createQuoteResponse);
            setIsCreateOpenDrawer(false);
            backToInitialStateCreateQuotationDrawer();
        } catch (error) {
            console.error("Form validation failed", error);
            showNotification("WARNING", "Fill all required fields.");
        }
    };

    const onCloseDrawer = async () => {
        setIsCreateOpenDrawer(false);
        backToInitialStateCreateQuotationDrawer();
    };

    return (
        <Drawer
            title={
                <span className="font-2xl-semi-bold">
                        {"Create Agreement"}
                        </span>
            }
            style={{paddingBottom: 0}}
            closeIcon={
                <BssSquareButton type="CLOSE" className="close-icon"/>
             }
            placement="right"
            onClose={onCloseDrawer}
            open={isOpenCreateDrawer}
            footer={
                <div className="bss-ui-drawer-footer text-align-right drawer-footer">
                <Button onClick={handleSubmit} type="primary">Save</Button>
            </div>}
            width={830}
            className="drawer-component bss-ui-drawer"
        >
            <CreateQuotationDrawerContent quoteInfoForm={quoteInfoForm} contractInfoForm={contactInfoForm}
                                          billingInfoForm={billingInfoForm} pricingDefaultsForm={pricingDefaultsForm}
                                          primaryContact={filteredContact?.familyName + ' ' + filteredContact?.givenName}
                                          owner={filteredOpportunity?.owner}
                                          opportunity={filteredOpportunity?.name}
                                          amount={filteredOpportunity?.amount}
                                          setSelectedPriceBook={setSelectedPriceBook}
                                          searchPriceBookList={searchPriceBookList}
                                          setSearchPriceBookList={setSearchPriceBookList}
            />
        </Drawer>
    );
}

export default CreateQuotationDrawer;
