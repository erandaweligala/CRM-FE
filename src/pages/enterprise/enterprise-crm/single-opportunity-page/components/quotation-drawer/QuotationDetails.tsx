import { FC, useEffect, useMemo, useState } from "react";
import { Button, Empty, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Quote, QuotesResponseBodyModel } from "./models/quotes-response-body-model";
import { onCell } from "../../../../../../helpers/table-on-cell-values";
import { BSS_SquareButton as BssSquareButton } from "bss-component-library";
import QuoteEditViewDrawer from "./quotation-view-edit-drawer/QuoteEditViewDrawer";
import BssCollapse from "../../../../../../components/BSS_Collapse/BSS_Collapse";
import StatusSectionModel from "../../../accounts-page/models/StatusSection.model";
import CreateQuotationDrawer from "./create-quotation-drawer/CreateQuotationDrawer";
import ReinitiateQuotationDrawer from "./reinitiate-quotation-drawer/ReinitiateQuotationDrawer";
import { getQuotationDetailsList } from "./services/QuotationDetails.service";
import showNotification from "../../../../../../services/notification.service";
import { OrganizationalCustomer } from "./models/organization-list-response-model";
import { IndividualCustomer } from "./models/customer-data-response-model";
import { OpportunityListModel } from "./models/response/opportunity-list-response-model";
import EntityDetail from "../../../common-models/EntityDetail";
import { getValueFromSection } from "../../../../../../helpers/mapEntityDetails";

export interface QuotationDetailsProps {
    timeLineData: StatusSectionModel | undefined;
    entityId: string;
    filteredDetails: { title: string; accountDetails: EntityDetail[] }[];
    quoteCreationStatus: boolean;
    setRef: (el: HTMLDivElement | null) => void;
}

const QuotationDetails: FC<QuotationDetailsProps> = ({
    timeLineData,
    entityId,
    filteredDetails,
    quoteCreationStatus,
    setRef,    
}) => {
    const [selectedQuote, setSelectedQuote] = useState({
        operation: "VIEW" as const,
        isDrawerOpen: false,
        selectedQuote: null as Quote | null,
    });
    const [quoteList, setQuoteList] = useState<Quote[]>([]);
    const [isNewQuoteDrawerOpen, setIsNewQuoteDrawerOpen] = useState(false);
    const [reinitiateDrawerOpen, setReinitiateDrawerOpen] = useState(false);
    const [entityDetails, setEntityDetails] = useState({} as {
        accountDetails?: OrganizationalCustomer;
        contactDetails?: IndividualCustomer;
        dealDetails?: OpportunityListModel;
    });

    const mapEntityDetails = () => {
        const account = filteredDetails.find(s => s.title === "Account Details")?.accountDetails || [];
        const contact = filteredDetails.find(s => s.title === "Contact Details")?.accountDetails || [];
        const deal = filteredDetails.find(s => s.title === "Opportunity Details")?.accountDetails || [];

        return {
            accountDetails: {
                id: getValueFromSection(account, "141"),
                brId: getValueFromSection(account, "115"),
                href: getValueFromSection(account, "116"),
                name: getValueFromSection(account, "114"),
                roleName: "Customer",
                type: "OrganizationalCustomer",
                baseType: "PartyRole",
            },
            contactDetails: {
                id: getValueFromSection(contact, "129") || null,
                href: getValueFromSection(contact, "130") || null,
                givenName: getValueFromSection(contact, "126"),
                familyName: getValueFromSection(contact, "127"),
                role: "Contact Person",
                designation: getValueFromSection(contact, "128"),
                type: "IndividualCustomer",
                baseType: "PartyRole",
            },
            dealDetails: {
                id: entityId,
                owner: getValueFromSection(deal, "106"),
                name: getValueFromSection(deal, "139"),
                oppType: getValueFromSection(deal, "110"),
                validFor: {
                    startDateTime: null,
                    endDateTime: getValueFromSection(deal, "111"),
                },
                amount: getValueFromSection(deal, "113"),
                type: "OpportunityListModel",
                baseType: "Opportunity",
            },
        };
    };

    useEffect(() => {
        getQuotationDetailsList(entityId).then((res: QuotesResponseBodyModel) => {
            setQuoteList(res.quoteList);
        });
    }, [entityId]);

    useEffect(() => {
        if (!isNewQuoteDrawerOpen) {
            getQuotationDetailsList(entityId).then((res: QuotesResponseBodyModel) => {
                setQuoteList(res.quoteList);
            });
        }
    }, [isNewQuoteDrawerOpen]);

    useEffect(() => {
        if (quoteCreationStatus && filteredDetails.length >= 3) {
            setEntityDetails(mapEntityDetails());
        }
    }, [quoteCreationStatus, filteredDetails]);

    const openCreateQuoteDrawer = () => {
        if (quoteCreationStatus) {
            setIsNewQuoteDrawerOpen(true);
        } else {
            showNotification("INFO", "Quote creation is not enabled for this deal stage");
        }
    };

    const tableColumns: ColumnsType<Quote> = useMemo(() => [
        {
            title: "Agreement ID",
            dataIndex: "id",
            key: "id",
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Agreement Name",
            dataIndex: "name",
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Currency Code",
            dataIndex: "currency",
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Agreement Status",
            dataIndex: "status",
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "action",
            align: "center",
            width: 50,
            render: (_, record: Quote) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                    <BssSquareButton
                        onClick={() => setSelectedQuote({
                            operation: "VIEW",
                            isDrawerOpen: true,
                            selectedQuote: record,
                        })}
                        type="VIEW"
                    />
                </div>
            ),
        },
    ], []);

    return (
        <div ref={(reference) => setRef(reference)}>
            <BssCollapse
                title="Agreements"
                defaultExpanded
                extra={(
                    <>
                        <Button type="primary" htmlType="submit" className="mr-1" size="small" onClick={openCreateQuoteDrawer}>
                            Create Agreement
                        </Button>
                        {timeLineData?.stage === "negotiationOrReview" && (
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="small"
                                onClick={() => setReinitiateDrawerOpen(true)}
                            >
                                Reinitiate Agreement Process
                            </Button>
                        )}
                    </>
                )}
            >
                {quoteList.length > 0 ? (
                    <div className="collapsed-content">
                        <Table
                            columns={tableColumns}
                            dataSource={quoteList}
                            rowKey="id"
                        />
                    </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}
            </BssCollapse>

            <QuoteEditViewDrawer
                operationType={selectedQuote.operation}
                isQuoteEditViewDrawerOpen={selectedQuote.isDrawerOpen}
                closeQuoteEditViewDrawer={() => setSelectedQuote({ operation: "VIEW", isDrawerOpen: false, selectedQuote: null })}
                quoteData={selectedQuote.selectedQuote}
            />
            <CreateQuotationDrawer
                isOpenCreateDrawer={isNewQuoteDrawerOpen}
                setIsCreateOpenDrawer={setIsNewQuoteDrawerOpen}
                entityDetails={entityDetails}
            />
            <ReinitiateQuotationDrawer
                openCreateReinitiateQuotationDrawerDrawer={reinitiateDrawerOpen}
                closeCreateReinitiateQuotationDrawerDrawer={() => setReinitiateDrawerOpen(false)}
                reloadQuotations={() => getQuotationDetailsList(entityId).then(res => setQuoteList(res.quoteList))}
                entityId={entityId}
            />
        </div>
    );
};

export default QuotationDetails;