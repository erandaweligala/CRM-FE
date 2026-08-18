import {FC} from "react";
import {Account} from "../../../../models/AccountModel";
import {Descriptions} from "antd";

interface AccountInfoProps {
    data: Account;
}

const AccountInfo: FC<AccountInfoProps> = ({data}) => {


    return (
        <Descriptions bordered labelStyle={{width: 150}}>
            <Descriptions.Item label="Account ID">{data.accountInfo.accountId}</Descriptions.Item>
            <Descriptions.Item label="Account Type">{data.accountInfo.accountType}</Descriptions.Item>
            <Descriptions.Item label="Account Status">{data.accountInfo.accountStatus}</Descriptions.Item>
            <Descriptions.Item label="Last Modified Date">{data.accountInfo.lastModifiedDate}</Descriptions.Item>
            <Descriptions.Item label="Rating Type">{data.accountInfo.ratingType}</Descriptions.Item>
            {
                data.accountName.toUpperCase() === "POSTPAID" && (
                    <>
                        <Descriptions.Item label="Billing Address" span={2}>{data.accountInfo.billingAddress}</Descriptions.Item>
                        <Descriptions.Item label="Payment Status">{data.accountInfo.paymentStatus}</Descriptions.Item>
                        <Descriptions.Item label="Default Payment Method">{data.accountInfo.defaultPaymentMethod}</Descriptions.Item>
                    </>
                )

            }
            <Descriptions.Item label="Main Balance">{data.accountInfo.mainBalance}</Descriptions.Item>
        </Descriptions>
    )
}

export default AccountInfo;