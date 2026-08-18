import {FC} from "react";
import {Collapse, Skeleton} from 'antd';
import CustomerInfo from "./components/customer-info/CustomerInfo";
import CreditRating from "./components/credit-rating/CreditRating";
import CustomerCharacteristics from "./components/customer-characteristics/CustomerCharacteristics";
import {useAppSelector} from "../../../../../../store/main-store";
import {collapseCommonProps} from "../../../../../../configs/common-props/common-props";
import OrganizationInfo from "./components/organization-info/OrganizationInfo";
import AddHierarchy from "./components/add-hierarchy/AddHierarchy";
import AddRelatedParty from "./components/add-related-party/AddRelatedParty";
import AddTaxExemption from "./components/add-tax-exemption/AddTaxExemption";
import ContactDetails from "../../../../../customer-profile/components/customer-profile-tab/components/contact-details/ContactDetails";
import LanguageAbility from "../../../../../customer-profile/components/customer-profile-tab/components/language-ability/LanguageAbility";
import ExternalReference from "../../../../../customer-profile/components/customer-profile-tab/components/external-reference/ExternalReference";
import Identification from "../../../../../customer-profile/components/customer-profile-tab/components/identification/Identification";
import Skills from "../../../../../customer-profile/components/customer-profile-tab/components/skills/Skills";

const {Panel} = Collapse;

interface CustomerProfileTabProps {
    onReloadTabDataRequest: () => void
}

const CustomerProfileTab: FC<CustomerProfileTabProps> = ({onReloadTabDataRequest}) => {

    const customerProfileDataFromStore = useAppSelector(state => state.customer.customerProfile);

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
                customerProfileDataFromStore?.customerType==="Individual" &&
                <Collapse
                    {...collapseCommonProps}
                    defaultActiveKey={['1']}
                    className="digital-bss-basic-collapse"
                >
                    <Panel header="Customer Info" key="1">
                        <CustomerInfo
                            data={customerProfileDataFromStore.customerInfo}
                            customerSystemId={customerProfileDataFromStore.customerInfo.customerId}
                            onTriggerReloadProfileTab={reloadProfileTab}
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
                            customerSystemId={customerProfileDataFromStore.customerInfo.customerId}
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
                            customerSystemId={customerProfileDataFromStore.customerInfo.customerId}
                            onTriggerReloadProfileTab={reloadProfileTab}
                        />
                    </Panel>
                    <Panel header="External Reference" key="7">
                        <ExternalReference
                            data={customerProfileDataFromStore.externalReference}
                            customerSystemId={customerProfileDataFromStore.customerInfo.customerId}
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
                {
                customerProfileDataFromStore?.customerType==="Organization" &&
                <Collapse
                    {...collapseCommonProps}
                    defaultActiveKey={['1']}
                    className="digital-bss-basic-collapse"
                >
                    <Panel header="Organization Info" key="1">
                        <OrganizationInfo
                            data={customerProfileDataFromStore.organizationInfo}
                            customerSystemId={customerProfileDataFromStore.organizationInfo.id ?? ''}
                            onTriggerReloadProfileTab={reloadProfileTab}
                        />
                    </Panel>
                    <Panel header="External Reference" key="2">
                        <ExternalReference
                            data={customerProfileDataFromStore.externalReference}
                            customerSystemId={customerProfileDataFromStore.organizationInfo.id ?? ''}
                            onTriggerReloadProfileTab={reloadProfileTab}
                        />
                    </Panel>
                    <Panel header="Identification" key="3">
                        <Identification
                            data={customerProfileDataFromStore.identification}
                        />
                    </Panel>
                    <Panel header="Credit Rating" key="4">
                        <CreditRating
                            data={customerProfileDataFromStore.creditRating}
                        />
                    </Panel>
                    <Panel header="Contact Details" key="5">
                        <ContactDetails
                            data={customerProfileDataFromStore.contactDetails}
                            customerSystemId={customerProfileDataFromStore.organizationInfo.id ?? ''}
                            onTriggerReloadProfileTab={reloadProfileTab}
                        />
                    </Panel>
                    <Panel header="Hierarchy" key="6">
                        <AddHierarchy
                            data={customerProfileDataFromStore.hierarchies}
                            customerSystemId={customerProfileDataFromStore.organizationInfo.id ?? ''}
                            onTriggerReloadProfileTab={reloadProfileTab}
                        />
                    </Panel>
                    <Panel header="Related Party" key="7">
                        <AddRelatedParty
                            data={customerProfileDataFromStore.relatedParties}
                            customerSystemId={customerProfileDataFromStore.organizationInfo.id ?? ''}
                            onTriggerReloadProfileTab={reloadProfileTab}
                        />
                    </Panel>
                    <Panel header="Tax Exemption" key="8">
                        <AddTaxExemption
                            data={customerProfileDataFromStore.taxExemptions}
                            customerSystemId={customerProfileDataFromStore.organizationInfo.id ?? ''}
                            onTriggerReloadProfileTab={reloadProfileTab}
                        />
                    </Panel>
                    <Panel header="Customer Characteristics" key="9">
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