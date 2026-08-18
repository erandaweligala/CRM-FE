import { FC } from "react";
import "./GeneralInfoCard.scss";
import { Button, Skeleton, Table } from "antd";
import { useAppSelector } from "../../../../../../store/main-store";
import profileIcon from "../../../../../../assets/images/profile-icon.png";
import Birthday from "../../../../../../assets/images/Birthday.svg?react";
import DigitalBssText from "../../../../../../components/DigitalBssText/DigitalBssText";
import DigitalBssTagLabel from "../../../../../../components/DigitalBssTagLabel_Temp";
import DigitalBssLabelValueHorizontal from "../../../../../../components/DigitalBssLabelValueHorizontal";
interface GeneralInfoCardProps {
    handleCustomerProfileClick: () => void;
}


const GeneralInfoCard: FC<GeneralInfoCardProps> = ({ handleCustomerProfileClick }) => {

    const customerOverviewFromStore = useAppSelector(state => state.customer.customerOverview);
    const managedByData = customerOverviewFromStore?.customerOverview?.manageBy || [];

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            align: 'left' as const,
            render: (text: string) => <strong>{text}</strong>,
        },
        { title: "Role", dataIndex: "role", key: "role",  align: 'right' as const,},
    ];
    const preferredContactTime = customerOverviewFromStore?.customerOverview?.preferredContactTime ?? '';
    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        const options = {
            hour: '2-digit' as const,
            minute: '2-digit' as const,
            hour12: true,
            timeZone: 'UTC',
        };
        return date.toLocaleString('en-US', options);
    };
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        const options = {
            year: 'numeric' as const,
            month: 'long' as const,
            day: 'numeric' as const,
            hour: '2-digit' as const,
            minute: '2-digit' as const,
            hour12: true,
            timeZone: 'UTC',
        };
        return date.toLocaleString('en-US', options);
    };
    const splitValues = preferredContactTime.split(/-(?=\d{4}-\d{2}-\d{2}T)/);
    if (splitValues.length !== 2) {
        console.error('Invalid format for preferredContactTime:', preferredContactTime);
    }
    const [startDateRaw, endDateRaw] = splitValues.map((date) => date.trim());
    const startDate = new Date(startDateRaw);
    const endDate = new Date(endDateRaw);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Invalid date values after parsing:', startDateRaw, endDateRaw);
    }
    const formattedStartDate = formatTime(startDateRaw);
    const formattedEndDate = formatTime(endDateRaw);
    const formattedContactPeriod = `${formattedStartDate} - ${formattedEndDate}`;
    
    const registeredDate = customerOverviewFromStore?.customerOverview?.registedDate;
    const formattedRegisteredDate = registeredDate ? formatDate(registeredDate) : 'Not available';

    return (
        <>
            {
                !customerOverviewFromStore &&
                <Skeleton active={true} paragraph={{ rows: 10 }} />
            }

            {
                customerOverviewFromStore &&
                <div className="general-info-card">

                    <div className="header-section">
                        <div className="image-and-name-container" style={{ display: 'flex', alignItems: 'center'}}>
                            <div
                                style={{
                                    border: ' 3px solid #DBDBDB',
                                    borderRadius: '111px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '54px',
                                    height: '54px',
                                }}
                            >
                                <img
                                    src={profileIcon}
                                    alt="Profile Icon"
                                    width={44}
                                    height={44}
                                    style={{ borderRadius: '50%' }}
                                />
                            </div>
                            <div style={{ paddingLeft: '12px' }}>
                                <div className="name">
                                    <DigitalBssText
                                        size="xl"
                                        style="semi-bold"
                                        color="primary"
                                    >
                                        {customerOverviewFromStore.customerOverview.name}
                                    </DigitalBssText>
                                </div>
                                <Button
                                   className="view-square-button-pre-defined"
                                    type="default"
                                    htmlType="submit"
                                    size="small"
                                    onClick={() => handleCustomerProfileClick()}
                                >
                                    View Profile
                                </Button>
                            </div>
                        </div>

                        {customerOverviewFromStore.customerOverview.isBirthday && (
                            <DigitalBssTagLabel
                                icon={<Birthday />}
                                text="Happy Birthday!"
                                backgroundColor="#F7941E"
                                className="mt-3"
                            />
                        )}
                    </div>
                    <div className="body-section">
                        <DigitalBssLabelValueHorizontal label="Customer Type"
                            value={customerOverviewFromStore.customerOverview.type|| "Not provided"} />
                        <DigitalBssLabelValueHorizontal label="Preferred Language"
                            value={customerOverviewFromStore.customerOverview.preferredLanguage|| "Not specified"} />
                        <DigitalBssLabelValueHorizontal label="Contact No"
                            value={customerOverviewFromStore.customerOverview.contactNo|| "Not available"} />
                        <DigitalBssLabelValueHorizontal label="E-Mail" value={customerOverviewFromStore.customerOverview.email|| "Not provided"} />
                        <DigitalBssLabelValueHorizontal label="Customer ID/Passport"
                            value={<span style={{color:"#005B9E"}}>{customerOverviewFromStore.customerOverview.customerIdentification||"Not specified"}</span>} />
                        <DigitalBssLabelValueHorizontal label="Registered Date"
                            value={formattedRegisteredDate|| "Not available"} />
                        <DigitalBssLabelValueHorizontal label="Preferred Method of Contact"
                            value={
                                (() => {
                                    switch (customerOverviewFromStore.customerOverview.preferredContactMethod?.toUpperCase()) {
                                        case "CALL":
                                            return "Mobile";
                                        case "EMAIL":
                                            return "Email";
                                        case "WHATSAPP":
                                            return "WhatsApp";
                                        default:
                                            return "Not specified";
                                    }
                                })()
                            } />
                        <DigitalBssLabelValueHorizontal label="Preferred Contact Period"
                            value={formattedContactPeriod || "Not specified"} />
                    </div>
                    <div className="managed-by-card" style={{ margin: 12, border: "1px solid #F2F2F2" }}>
                        <header className="header-section" >
                            <DigitalBssText size="lg" style="semi-bold" color="primary">
                                Managed by
                            </DigitalBssText>
                        </header>
                        <Table
                            columns={columns}
                            dataSource={managedByData}
                            pagination={false}
                            showHeader={false} />
                    </div>
                </div>
            }
        </>
    )
}

export default GeneralInfoCard;