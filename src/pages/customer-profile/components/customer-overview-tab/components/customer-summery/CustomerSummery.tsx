import {Col, Empty, Row} from "antd";
import {FC} from "react";
import "./CustomerSummery.scss";
import DollarSign from "../../../../../../assets/images/dollar-sign.svg?react";
import NPSSign from "../../../../../../assets/images/small-smily-face.svg?react";
import npsHappy from "../../../../../../assets/images/NPS - Happy.png";
import npsNeutral from "../../../../../../assets/images/NPS - Neutral.png";
import npsLow from "../../../../../../assets/images/NPS - Low.png";
import {CustomerSummeryModel} from "../../../../models/CustomerOverviewModel";
import { BSS_Container } from "bss-component-library";

interface CustomerSummeryProps {
   data: CustomerSummeryModel;
}

const CustomerSummery: FC<CustomerSummeryProps> = ({data}) => {

   return (
      <BSS_Container
         title="Customer Summary"
         className="mb-3"
      >
         {!data && <Empty className="mt-4 mb-3"/>}

         {data && (
            <>
               <div className="summery-body-section">
                  <Row>
                     <Col span={8}>

                        <div className="content-center-vertical">

                           <div className="mr-3">{<DollarSign/>}</div>

                           <div className="font-md-semi-bold">Revenue</div>

                        </div>

                        <div className="summery-revenue-text">{data.revenue}</div>

                     </Col>

                     {/* right side column data */}
                     <Col span={8} offset={8}>

                        <div style={{float: "right"}}>

                           <div
                              className="content-center-vertical"
                              style={{float: "right"}}
                           >

                              <div className="mr-3">{<NPSSign/>}</div>

                              <div className="font-md-semi-bold">{"NPS"}</div>

                           </div>

                           <div>

                              {
                                 (data.nps === '1') && <img src={npsHappy} alt="happy" width={40}/>
                              }
                              {
                                 (data.nps === '2') && <img src={npsNeutral} alt="neutral" width={40}/>
                              }
                              {
                                 (data.nps === '3') && <img src={npsLow} alt="low" width={40}/>
                              }

                           </div>

                        </div>

                     </Col>
                  </Row>

               </div>

               <div className="content-date mb-4">

                  <div className="summery-date content-center-horizontal font-sm-semi-bold pa-3">

                     {data.period}

                  </div>

               </div>
            </>
         )}
      </BSS_Container>
   );
};

export default CustomerSummery;
