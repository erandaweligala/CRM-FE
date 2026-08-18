import {FC} from "react";
import {Collapse, Skeleton} from "antd";
import AccountInfo from "./components/account-info/AccountInfo";
import AccountCredit from "./components/account-credit/AccountCredit";
import AccountBalance from "./components/account-balance/AccountBalance";
import OutstandingDetails from "./components/outstanding-details/OutstandingDetails";
import PaymentPlan from "./components/payment-plan/PaymentPlan";
import BillingDetails from "./components/billing-details/BillingDetails";
import {useAppSelector} from "../../../../store/main-store";
import {collapseCommonProps} from "../../../../configs/common-props/common-props";
import QuotaCategory from "./components/quota-category/QuotaCategory";
import Bills from "./components/bills/Bills";

const {Panel} = Collapse;

interface AccountTabProps {
}

const AccountTab: FC<AccountTabProps> = () => {

    const accountDataFromStore = useAppSelector(state => state.customerProfile.account);


    return (
        <>
            {!accountDataFromStore && (
                <Skeleton active={true} paragraph={{rows: 10}}/>
            )}

            <Collapse
                {...collapseCommonProps}
                className="digital-bss-basic-collapse"
                key="AccountTabCollapse"
            >
                 {
                    (accountDataFromStore?.accounts?.length ?? 0) > 0 &&
                    accountDataFromStore?.accounts?.map((singleAccount) => {
                        return (
                            <Panel header={singleAccount.accountName} key={singleAccount.accountName}>
                                <Collapse
                                    {...collapseCommonProps}
                                    defaultActiveKey={["1"]}
                                    className="digital-bss-basic-collapse"
                                >
                                    <Panel header="Account Info" key="1">
                                        <AccountInfo data={singleAccount}/>
                                    </Panel>
                                    {
                                        singleAccount.accountName.toUpperCase() === "POSTPAID" &&
                                        <>
                                            <Panel header="Account Credit" key="2">
                                                <AccountCredit data={singleAccount.accountCredit}/>
                                            </Panel>
                                            <Panel header="Account Balance" key="3">
                                                <AccountBalance data={singleAccount.accountBalance}/>
                                            </Panel>
                                            <Panel header="Outstanding Details" key="4">
                                                <OutstandingDetails
                                                    data={singleAccount.outstandingDetails}
                                                />
                                            </Panel>
                                            <Panel header="Payment Plan" key="5">
                                                <PaymentPlan data={singleAccount.paymentPlan}/>
                                            </Panel>
                                            <Panel header="Billing Details" key="6">
                                                <BillingDetails data={singleAccount.billingDetails}/>
                                            </Panel>
                                            <Panel header="Bills" key="7">
                                                <Bills data={singleAccount.customerBills}/>
                                            </Panel>
                                        </>
                                    }
                                </Collapse>
                            </Panel>

                        )
                            ;
                    })
                }

                {
                    (accountDataFromStore?.quota?.length ?? 0) > 0 && (

                        <Panel header={"Quota"} key="1">
                            <Collapse
                                {...collapseCommonProps}
                                defaultActiveKey={["1"]}
                                className="digital-bss-basic-collapse"
                            >

                                {
                                    accountDataFromStore?.quota.map((singleBucket) => {
                                        return (
                                            <Panel header={singleBucket.usageType} key={singleBucket.usageType}>
                                                <QuotaCategory data={singleBucket.quotaByName}/>
                                            </Panel>
                                        )
                                    })
                                }
                            </Collapse>
                        </Panel>

                    )

                }
            </Collapse>


        </>
    );
}

export default AccountTab;
