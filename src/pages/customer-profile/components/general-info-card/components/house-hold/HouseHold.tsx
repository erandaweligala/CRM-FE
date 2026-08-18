import { Empty, Tooltip } from "antd";
import { FC } from "react";
import './HouseHold.scss'
import { HouseMemberItemModel } from "../../../../models/CustomerOverviewModel";
import DigitalBssText_Temp from "../../../../../../components/DigitalBssText/DigitalBssText";
import { BSS_Container } from "bss-component-library";
interface HouseHoldProps {
  data: HouseMemberItemModel[];
}
const HouseHold: FC<HouseHoldProps> = ({data}) => {


  return (
    <BSS_Container
        title="House Hold"
        className="mb-3">

      {(!data || data.length === 0) && <Empty className="mt-4 mb-3" />}

      {data &&
       data.length > 0 &&
       data.map((item)=> (

        <div className="house-hold-item" key={item.name}>
          <div className="house-hold-content-section">
            <div>
                <DigitalBssText_Temp 
                  size='md'
                  style='semi-bold'
                  children= {item.name}
                  color="primary"
                />
            </div>
          
          <>
            <div className="content-center-vertical">   

              {
                item.accountStatus === 'Active' && <Tooltip placement="top" title="Active"><div className="account-status-active"/></Tooltip>
              } 
              {
                item.accountStatus === 'Suspend' && <Tooltip placement="top" title="Suspend"><div className="account-status-suspend"/></Tooltip>
              } 
              {
                item.accountStatus === 'Call Bar' && <Tooltip placement="top" title="CallBar"><div className="account-status-call-bar"/></Tooltip>
              } 
              
              <a >
                <u className="font-md-regular">
                      {item.serviceNumber}
                </u>
              </a>

            </div>                    
          </>
        </div>
      </div>

      ))}
   </BSS_Container>
 );
};

export default HouseHold;
