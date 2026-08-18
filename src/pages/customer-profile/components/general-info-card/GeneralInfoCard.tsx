import { FC } from "react";
import "./GeneralInfoCard.scss";
import { Col, Row, Skeleton } from "antd";
import { useAppSelector } from "../../../../store/main-store";
import profileIcon from "../../../../assets/images/profile-icon.png";
import NextBestOffer from "./components/next-best-offer/NextBestOffer";
import DigitalBssText from "../../../../components/DigitalBssText/DigitalBssText";
import DigitalBssLabelValueHorizontal from "../../../../components/DigitalBssLabelValueHorizontal";
import Birthday from "../../../../assets/images/Birthday.svg?react";
import Apple from "../../../../assets/images/apple-logo.svg?react";
import Android from "../../../../assets/images/Android logo Icon 04.svg?react";
import Youtube from "../../../../assets/images/youtube.svg?react";
import Tiktok from "../../../../assets/images/Tiktok.svg?react";
import Facebook from "../../../../assets/images/facebook.svg?react";

import HouseHold from "./components/house-hold/HouseHold";
import HotProducts from "./components/hot-products/HotProducts";
import DigitalBssTagLabel from "../../../../components/DigitalBssTagLabel_Temp/DigitalBssTagLabel_Temp";
interface GeneralInfoCardProps {
}


const GeneralInfoCard: FC<GeneralInfoCardProps> = () => {

    const customerOverviewFromStore = useAppSelector(state => state.customerProfile.customerOverview);
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
                        <div className="image-and-name-container">
                            <div style={{ border: '3px solid #B7B5B0', borderRadius: '100%' }}>
                                <div className="image-border">
                                    <img
                                        src={profileIcon}
                                        alt="Profile Icon"
                                        width={54}
                                    />
                                </div>
                            </div>
                            <div className="pl-3">
                                <div className="name">
                                    <DigitalBssText
                                        size='xl'
                                        style='semi-bold'
                                        color="primary"
                                    >
                                        {customerOverviewFromStore.customerOverview.name}
                                    </DigitalBssText>
                                </div>
                                <div className="point">
                                    <DigitalBssText
                                        size='lg'
                                        style='regular'
                                        color="tertiary"
                                    >
                                        100 Pts
                                    </DigitalBssText>
                                </div>
                            </div>
                        </div>

                        {
                            customerOverviewFromStore.customerOverview.isBirthday &&
                            <DigitalBssTagLabel
                                icon={<Birthday />}
                                text="Happy Birthday!"
                                backgroundColor="#F7941E"
                                className="mt-3"
                            />
                        }

                        <Row gutter={[12, 12]} className="mt-3">
                            <Col span={8}>
                                <DigitalBssTagLabel
                                    text={customerOverviewFromStore.customerOverview.customerStatus ?? "Not Supporting"}
                                    backgroundColor="#5FB900"
                                />
                            </Col>
                            {
                                customerOverviewFromStore.customerOverview.isBlackListed &&
                                <Col span={8}>
                                    <DigitalBssTagLabel
                                        text="Blacklisted"
                                        backgroundColor="#ED665D"
                                    />
                                </Col>
                            }
                            <Col span={8}>
                                <DigitalBssTagLabel
                                    text={"Low Credit"}
                                    backgroundColor="#ED665D"
                                />
                            </Col>
                            <Col span={8}>
                                <DigitalBssTagLabel
                                    text={"Low Churn"}
                                    backgroundColor="#5FB900"
                                />
                            </Col>
                        </Row>

                    </div>

                    <div className="body-section">
                        <DigitalBssLabelValueHorizontal label="Customer Type"
                            value={customerOverviewFromStore.customerOverview.type || "Not provided"} />
                        <DigitalBssLabelValueHorizontal label="Preferred Language"
                            value={customerOverviewFromStore.customerOverview.preferredLanguage || "Not specified"} />
                        <DigitalBssLabelValueHorizontal label="Contact No"
                            value={customerOverviewFromStore.customerOverview.contactNo || "Not available"} />
                        <DigitalBssLabelValueHorizontal label="E-Mail" value={customerOverviewFromStore.customerOverview.email || "Not provided"} />
                        <DigitalBssLabelValueHorizontal label="Customer ID/Passport"
                            value={<span style={{ color: "#005B9E" }}>{customerOverviewFromStore.customerOverview.customerIdentification || "Not specified"}</span>} />
                        <DigitalBssLabelValueHorizontal label="Registered Date"
                            value={formattedRegisteredDate || "Not available"} />
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
                        <DigitalBssLabelValueHorizontal label="Device Preferences"
                            value={
                                <>
                                    {customerOverviewFromStore.customerOverview.devicePreference === 'APPLE' && <Apple />}
                                    {customerOverviewFromStore.customerOverview.devicePreference === 'ANDROID' && <Android />}
                                </>
                            }
                        />
                        <DigitalBssLabelValueHorizontal label="Customer Service Preferences" value={customerOverviewFromStore.customerOverview.preferredCustomerService} />
                        <DigitalBssLabelValueHorizontal label="Billing and Payment" value={customerOverviewFromStore.customerOverview.billingAndPayment} />
                        <DigitalBssLabelValueHorizontal label="Channels"
                            value={
                                customerOverviewFromStore.customerOverview?.channels?.map((channel) => {
                                    if (channel === "YOUTUBE") {
                                        return <Youtube key={channel} />
                                    } else if (channel === "FACEBOOK") {
                                        return <Facebook className="ml-2" key={channel} />
                                    } else if (channel === "TIKTOK") {
                                        return <Tiktok className="ml-2" key={channel} />
                                    } else {
                                        return null
                                    }
                                }) ?? null
                            }
                        />
                    </div>

                    <div className="footer-section">

                        <HouseHold data={customerOverviewFromStore.customerOverview.houseMembers} />

                        <NextBestOffer />

                        <HotProducts />

                    </div>
                </div>
            }
        </>
    )
}

export default GeneralInfoCard;