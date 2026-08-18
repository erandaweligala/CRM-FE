import {FC, useState} from "react";
import {Button, Collapse, Skeleton} from 'antd';
import CustomerInfo from "./components/customer-info/CustomerInfo";
import Identification from "./components/identification/Identification";
import CreditRating from "./components/credit-rating/CreditRating";
import ContactDetails from "./components/contact-details/ContactDetails";
import Skills from "./components/skills/Skills";
import LanguageAbility from "./components/language-ability/LanguageAbility";
import ExternalReference from "./components/external-reference/ExternalReference";
import CustomerCharacteristics from "./components/customer-characteristics/CustomerCharacteristics";
import {useAppSelector} from "../../../../store/main-store";
import {collapseCommonProps} from "../../../../configs/common-props/common-props";

const {Panel} = Collapse;

interface CustomerProfileTabProps {
    onReloadTabDataRequest: () => void
}

const CustomerProfileTab: FC<CustomerProfileTabProps> = ({onReloadTabDataRequest}) => {

    const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState<boolean>(false);
    const customerProfileDataFromStore = useAppSelector(state => state.customerProfile.customerProfile);

    const reloadProfileTab = () => {
        onReloadTabDataRequest()
    }

    return (

        <>
            {
                !customerProfileDataFromStore &&
                <Skeleton active={true} paragraph={{rows: 10}}/>
            }

            {
                customerProfileDataFromStore &&
                <Collapse
                    {...collapseCommonProps}
                    defaultActiveKey={['1']}
                    className="digital-bss-basic-collapse"
                >
                    <Panel
                        header="Customer Info"
                        key="1"
                        extra={
                        <Button
                            type="default"
                            size="small"
                            onClick={() => setIsUpdateDrawerOpen(true)}
                        >
                            Update Customer Info
                        </Button>}
                    >
                        <CustomerInfo
                            data={customerProfileDataFromStore.customerInfo}
                            customerSystemId={customerProfileDataFromStore.customerInfo?.customerId}
                            onTriggerReloadProfileTab={reloadProfileTab}
                            isDrawerOpen = {isUpdateDrawerOpen}
                            setIsDrawerOpen={setIsUpdateDrawerOpen}
                        />
                    </Panel>
                    <Panel header="Identification" key="2">
                        <Identification
                            data={customerProfileDataFromStore.identification}
                        />
                    </Panel>
                    <Panel header="Credit Rating" key="3">
                        <CreditRating
                            data={customerProfileDataFromStore.creditRating}
                        />
                    </Panel>
                    <Panel header="Contact Details" key="4">
                        <ContactDetails
                            data={customerProfileDataFromStore.contactDetails}
                            customerSystemId={customerProfileDataFromStore.customerInfo?.customerId}
                            onTriggerReloadProfileTab={reloadProfileTab}
                        />
                    </Panel>
                    <Panel header="Skills" key="5">
                        <Skills
                            data={customerProfileDataFromStore.skills}
                        />
                    </Panel>
                    <Panel header="Language Ability" key="6">
                        <LanguageAbility
                            data={customerProfileDataFromStore.language}
                            customerSystemId={customerProfileDataFromStore.customerInfo?.customerId}
                            onTriggerReloadProfileTab={reloadProfileTab}
                        />
                    </Panel>
                    <Panel header="External Reference" key="7">
                        <ExternalReference
                            data={customerProfileDataFromStore.externalReference}
                            customerSystemId={customerProfileDataFromStore.customerInfo?.customerId}
                            onTriggerReloadProfileTab={reloadProfileTab}
                        />
                    </Panel>
                    <Panel header="Customer Characteristics" key="8">
                        <CustomerCharacteristics
                            data={customerProfileDataFromStore.customerCharacteristic}
                        />
                    </Panel>
                </Collapse>
            }
        </>
    )
}

export default CustomerProfileTab;