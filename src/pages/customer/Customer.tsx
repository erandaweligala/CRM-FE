import { FC, useEffect, useMemo, useState } from "react";
import { Col, Empty, Input, Row, Tree } from "antd";
import CustomerProfile from "./components/customer-profile/CustomerProfile";
import CustomerProfileRetailerView from "../customer-profile/CustomerProfile";
import PageNoData from '../../assets/images/page-no-data.svg?react';
import "./Customer.scss";
import PrInformation from "./components/customer-profile/components/pr-information/PrInformation";
import { SearchPanelModel } from "./components/customer-profile/models/SearchPanel.model";
import { useAppDispatch } from "../../store/main-store";
import { customerAction } from "../../store/customer.slice";
import { customerProfileAction } from "../../store/customer-profile.slice";
import GeneralInfoCard from "./components/customer-profile/components/general-info-card/GeneralInfoCard";
import DigitalBssText from "../../components/DigitalBssText";
import CustomerOverviewModel from "../customer-profile/models/CustomerOverviewModel";
import { AccountHierarchyModel } from "./components/customer-profile/models/AccountHierarchy.Model";
import { BSS_Breadcrumb as BssBreadcrumb, BSS_SearchPanel as BssSearchPanel, DefaultInputType, InputType } from "bss-component-library";
import { getCustomerOverviewData, getAccountHierarchyData } from "../customer-profile/services/customer-profile.service";

const defaultValues: DefaultInputType[] = [
    {
        valueName: "serviceReferenceType",
        defaultValue: "customerIdentification"
    },
    {
        valueName: "customerIdentificationType",
        defaultValue: "brid"
    }
];
const Customer: FC = () => {
    const [selectedOption, setSelectedOption] = useState(false);
    const [customerDetails, setCustomerDetails] = useState(false);
    const [selectedPaymentResponsibility, setSelectedPaymentResponsibility] = useState<string | null>(null);
    const [searchPanelData, setSearchPanelData] = useState<SearchPanelModel>();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [isCustomerIdTypeVisible, setIsCustomerIdTypeVisible] = useState(true);
    const [accountHierarchy, setAccountHierarchy] = useState<AccountHierarchyModel[]>([]);
    const [treeData, setTreeData] = useState<any[]>([]);
    const [customerType, setCustomerType] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const convertToTreeData = (nodes: AccountHierarchyModel[]): any[] => {
        return nodes.map((node) => ({
            title: node.accountName,
            key: node.accountId,
            children: node.children && node.children.length > 0 ? convertToTreeData(node.children) : [],
        }));
    };
    useEffect(() => {
        if (accountHierarchy.length > 0) {
            setTreeData(convertToTreeData(accountHierarchy));
        }
    }, [accountHierarchy]);

    const onTreeSelect = (selectedKeys: React.Key[]) => {
        if (selectedKeys.length > 0) {
            setSelectedKeys(selectedKeys);
            setSelectedOption(false);
            setSelectedPaymentResponsibility(selectedKeys[0]?.toString() || null);
        }
    };

    const handleCustomerProfileClick = () => {
        setSelectedKeys([]);
        setSelectedOption(true);
        setSelectedPaymentResponsibility(null);
    };

    const handleInputChange = (value: string) => {
     setIsCustomerIdTypeVisible(value === "customerIdentification");
    };
    const SearchPanelInputs: InputType[] = useMemo(() => [
        {
            type: "DROPDOWN",
            valueName: "serviceReferenceType",
            label: "Reference Type",
            required: true,
            mainInput: true,
            isVisible: true,
            placeholder: "Reference Type",
            onChange: handleInputChange,
            values: [
                { label: "Service Number", value: "serviceReference" },
                { label: "Customer ID", value: "customerId" },
                { label: "Customer Identification", value: "customerIdentification" }
            ]
        },
        {
            type: "DROPDOWN",
            valueName: "customerIdentificationType",
            label: "Identification Type",
            isVisible: isCustomerIdTypeVisible,
            required: true,
            mainInput: true,
            placeholder: "Identification Type",
            values: [
                { label: "National ID", value: "nic" },
                { label: "Business Registration ID", value: "brid" }
            ]
        },
        {
            type: "INPUT",
            valueName: "serviceReferenceValue",
            label: "Value",
            isVisible: true,
            required: true,
            mainInput: true,
            placeholder: "Value",
            maxLength: 100
        }
    ], [handleInputChange, isCustomerIdTypeVisible]);
    const submitSummarySearchForm = async (formValues: SearchPanelModel) => {
        dispatch(customerAction.clearStore());
        dispatch(customerProfileAction.clearStore());
        setSelectedKeys([]);
        setCustomerDetails(false);
        setSelectedOption(false);
        setSelectedPaymentResponsibility(null);
        console.log("formValues", formValues);

        try {
            if (formValues) {
                setSearchPanelData(formValues);
                let customerOverviewData: CustomerOverviewModel | null = null;
                let customerAccountHierarchy: AccountHierarchyModel[] | null = null;
                customerOverviewData = await getCustomerOverviewData(
                    formValues.serviceReferenceType === "customerIdentification"
                        ? formValues.customerIdentificationType
                        : formValues.serviceReferenceType,
                    formValues.serviceReferenceValue
                );
                console.log("customerOverviewData", customerOverviewData);
                if (customerOverviewData.customerOverview.customerType === "Organization") {
                    if (customerOverviewData?.customerOverview?.customerId) {
                        customerAccountHierarchy = await getAccountHierarchyData(customerOverviewData.customerOverview.customerId);
                        setAccountHierarchy(customerAccountHierarchy || []);
                        console.log("customerAccountHierarchy", customerAccountHierarchy);
                    }
                    dispatch(customerAction.setCustomerOverview(customerOverviewData));
                    dispatch(customerAction.setServiceReferenceType(formValues.serviceReferenceType));
                    dispatch(customerAction.setServiceReferenceValue(formValues.serviceReferenceValue));
                    dispatch(customerAction.setCustomerIdentificationType(formValues.customerIdentificationType));

                    if (customerOverviewData?.serviceReferenceList?.[0]?.serviceReference) {
                        dispatch(customerAction.setSelectedMsisdn(customerOverviewData.serviceReferenceList[0].serviceReference));
                    }

                    setCustomerDetails(true);
                    setSelectedOption(true);
                    setCustomerType("Organization");
                }
                if (customerOverviewData.customerOverview.customerType === "Individual") {
                    dispatch(customerProfileAction.setCustomerOverview(customerOverviewData));
                    dispatch(customerProfileAction.setSelectedMsisdn(customerOverviewData.serviceReferenceList[0].serviceReference));
                    setCustomerType("Individual");
                }

            }
        } catch (error) {
            console.error("Error fetching customer or account hierarchy data:", error);
        }
    };

    return (
        <>
            <div style={{ marginBottom: "15px" }}>
                <BssBreadcrumb>
                    <BssBreadcrumb.Section>CRM</BssBreadcrumb.Section>
                    <BssBreadcrumb.Section>Customer</BssBreadcrumb.Section>
                </BssBreadcrumb>
            </div>

            <div style={{ marginLeft: 40, marginRight: 40, marginTop: 12 }}>
                <BssSearchPanel
                    isExpandBtnVisible={false}
                    onSubmit={submitSummarySearchForm}
                    title="Search"
                    inputs={SearchPanelInputs}
                    key={'searchResults'}
                    defaultValues={defaultValues}
                    onClear={()=>{setIsCustomerIdTypeVisible(true)}}
                />
                {customerType === "Organization" &&
                    <div style={{ marginTop: 12 }}>
                        {customerDetails ? (
                            <Row gutter={[2, 2]} wrap>
                                <Col md={5} lg={7}>
                                    {customerDetails === true ? (
                                        <div>
                                            <div >
                                                {customerDetails === true ? <GeneralInfoCard handleCustomerProfileClick={handleCustomerProfileClick} /> : null}
                                            </div>
                                            <div
                                                className="general-info-card"
                                                style={{ marginBottom: "10px", marginTop: "12px", border: "1px solid #F2F2F2", borderRadius: "4px" }}
                                            >
                                                <div className="header-section">
                                                    <div className="image-and-name-container" style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{ paddingLeft: '12px' }}>
                                                            <div className="name">
                                                                <DigitalBssText
                                                                    size="xl"
                                                                    style="semi-bold"
                                                                    color="primary"
                                                                >
                                                                    Billing Accounts
                                                                </DigitalBssText>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="body-section"
                                                    style={{ marginLeft: "5px", borderRadius: "4px", marginBottom: "9px" }}
                                                >

                                                    <Input
                                                        placeholder="Search..."
                                                        style={{
                                                            border: "1px solid #E8E8E8",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    />
                                                    <Tree
                                                        onSelect={onTreeSelect}
                                                        treeData={treeData}
                                                        selectedKeys={selectedKeys}
                                                        style={{
                                                            marginTop: "9px",
                                                            marginLeft: "4px",
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    ) : null}
                                </Col>
                                <Col xs={24} sm={14} md={16} lg={17} style={{ paddingLeft: "16px" }}>
                                    {(() => {
                                        if (selectedOption === true) {
                                            return <CustomerProfile searchPanelData={searchPanelData} />;
                                        } else if (selectedPaymentResponsibility) {
                                            return (
                                                <PrInformation
                                                    key={selectedPaymentResponsibility}
                                                    selectedPaymentResponsibility={selectedPaymentResponsibility}
                                                />
                                            );
                                        } else {
                                            return (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        height: "200px",
                                                    }}
                                                >
                                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                                </div>
                                            );
                                        }
                                    })()}
                                </Col>
                            </Row>
                        ) : (
                            <div
                                style={{
                                    height: "247px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    marginTop: "66px",
                                }}
                            >
                                <PageNoData />
                                <div className="mt-3 font-md-regular">
                                    Not seeing anything here? Enter a search query to see results displayed below.
                                </div>
                            </div>
                        )}
                    </div>}
                {
                    customerType === "Individual" &&
                    <CustomerProfileRetailerView searchPanelData={searchPanelData} />
                }
                {customerType === null &&
                    <div
                        style={{
                            height: "247px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            marginTop: "66px",
                        }}
                    >
                        <PageNoData />
                        <div className="mt-3 font-md-regular">
                            Not seeing anything here? Enter a search query to see results displayed below.
                        </div>
                    </div>
                }
            </div>
        </>
    );
};

export default Customer;