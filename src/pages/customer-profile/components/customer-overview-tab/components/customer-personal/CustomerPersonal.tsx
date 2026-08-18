import {Col, Empty, Row, Tabs} from "antd";
import {FC} from "react";
import { CustomerPersonas } from "../../../../models/CustomerOverviewModel";
import DigitalBssTagLabel from "../../../../../../components/DigitalBssTagLabel_Temp";
import { BSS_Container as BssContainer } from "bss-component-library";
import { getSecureRandomIndex } from "../../../../../../helpers/random-number-generate";

const getRandomColor = (arr: string[]): string => {
  if (!arr || arr.length === 0) {
    throw new Error("Array must not be empty");
  }
  const randomIndex =getSecureRandomIndex(arr.length);
  return arr[randomIndex];
}

interface CustomerPersonalProps {
  data: CustomerPersonas[]
}

const CustomerPersonal: FC<CustomerPersonalProps> = ({data}) => {


  const backgroundColors: string[] = ['#3F8EB8','#70B59C','#ED665D'];

    return (
      <BssContainer 
        title="Customer Persona"
        height="300px"
        >
        {
            (!data || data.length === 0) && <Empty className="mt-4 mb-3" />
        }
        {
             data &&
             data.length > 0 && 

             <Tabs
                defaultActiveKey="1"
                tabPosition='top'
                items={data.map((child)=> {

                  return {
                    label: child.type,
                    key: child.type,
                    children: 
                      <Row 
                          gutter={[8,8]} 
                          className="mb-3"  
                          style={{marginRight: 7,marginLeft:7}}>

                          {child.personas?.map((item) => (
                              <Col span={8} key={item}>
                                <DigitalBssTagLabel
                                      text={item}
                                      backgroundColor={getRandomColor(backgroundColors) ?? '#3F8EB8'}
                                />
                              </Col>
                          ))}  
                      </Row>
                    
                  };
                })}

             />
             
        }
      </BssContainer>
    );
}

export default CustomerPersonal;