import {FC} from "react";
import {Button, Tooltip} from "antd";

import "./ConnectionTypeBtn.scss";

import Prepaid_Icon from "../../../../assets/images/prepaid-icon.svg?react";
import Postpaid_Icon from "../../../../assets/images/postpaid-icon.svg?react";
import GSM_Icon from "../../../../assets/images/gsm-icon.svg?react";
import Broadband_Icon from "../../../../assets/images/broadband-icon2.svg?react";

import AccountStatusEnum from "../../constants/account-status.enum";

interface ConnectionTypeBtn {
    msisdn: string
    isActive?: boolean;
    paymentType: "Prepaid" | "Postpaid";
    connectionType: "GSM" | "TV" | "BroadBand" | "Connections";
    accountStatus: AccountStatusEnum
    onClick: (selectedMsisdn: string) => void
}

const ConnectionTypeBtn: FC<ConnectionTypeBtn> = ({
                                                      msisdn,
                                                      isActive = false,
                                                      paymentType,
                                                      connectionType,
                                                      accountStatus,
                                                      onClick
                                                  }) => {
    return (
        <span className="connection-type-btn mr-2">
        <Button
            type="default"
            className={`${isActive ? "isActive" : ''}`}
            onClick={() => onClick(msisdn)}
        >
            <div className="content-center-all-side">

                {
                    accountStatus === AccountStatusEnum.Active && <Tooltip placement="top" title="Active"><div className="account-status-active"/></Tooltip>
                }
                {
                    accountStatus === AccountStatusEnum.Suspend && <Tooltip placement="top" title="Suspend"><div className="account-status-suspend"/></Tooltip>
                }
                {
                    accountStatus === AccountStatusEnum.CallBar && <Tooltip placement="top" title="CallBar"><div className="account-status-call-bar"/></Tooltip>
                }

                <div>{msisdn}</div>
                <div className="separator">|</div>
                {
                    paymentType === "Prepaid" && <Tooltip placement="top" title="Prepaid"><Prepaid_Icon fill={isActive ? "white" : "black"}/></Tooltip>
                }
                {
                    paymentType === "Postpaid" && <Tooltip placement="top" title="Postpaid"><Postpaid_Icon fill={isActive ? "white" : "black"}/></Tooltip>
                }
                <div className="separator">|</div>
                {
                    connectionType === "Connections" && <Tooltip placement="top" title="Mobile"><GSM_Icon fill={isActive ? "white" : "black"}/></Tooltip>
                }
                {
                    connectionType === "BroadBand" && <Tooltip placement="top" title="BroadBand"><Broadband_Icon fill={isActive ? "white" : "black"}/></Tooltip>
                }

            </div>

        </Button>
            </span>
    )
}

export default ConnectionTypeBtn;