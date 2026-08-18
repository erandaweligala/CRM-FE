import {FC, useState} from "react";
import "./ServiceAndUsage.scss";
import {QuotaSummaryElementModel, QuotaSummaryModel} from "../../../../models/ConnectionOverviewModel";
import { BSS_Container as BssContainer, BSS_SquareButton as BssSquareButton } from "bss-component-library";
import { MenuProps, Row, Col, Dropdown, Progress } from "antd";
import DigitalBssText from "../../../../../../components/DigitalBssText";
import CssProperties from "../../../../../../configs/css-properties";

interface ServiceAndUsageProps {
    data: QuotaSummaryModel[]
}

const ServiceAndUsage: FC<ServiceAndUsageProps> = ({data}) => {

    const [selectedVoicePack, setSelectedVoicePack] = useState<QuotaSummaryElementModel>(data[0].bucket[0]);
    const [selectedDataPack, setSelectedDataPack] = useState<QuotaSummaryElementModel>(data[1].bucket[0]);
    const [selectedSMSPack, setSelectedSMSPack] = useState<QuotaSummaryElementModel>(data[2].bucket[0]);


    const voiceOptions:MenuProps['items'] = data[0].bucket.map((singleDataPackage) => {
        return {label: singleDataPackage.name, key: singleDataPackage.name}
    })

    const dataOptions:MenuProps['items'] = data[1].bucket.map((singleDataPackage) => {
      return {key: singleDataPackage.name,label: singleDataPackage.name}
    })

    const smsOptions:MenuProps['items'] = data[2].bucket.map((singleDataPackage) => {
        return {label: singleDataPackage.name, key: singleDataPackage.name}
    })

   
    const onChangeVoicePack: MenuProps['onClick'] = ({ key }) => {
      setSelectedVoicePack(data[0].bucket.find((value) => value.name  === key)!)
    };
 
    const onChangeDataPack: MenuProps['onClick'] = ({ key }) => {
      setSelectedDataPack(data[1].bucket.find((value) => value.name  === key)!)
    }

    const onChangeSmsPack: MenuProps['onClick'] = ({ key }) => {
        setSelectedSMSPack(data[2].bucket.find((value) => value.name  === key)!)
    }


    return (
      <BssContainer
        titleComponent={
          <BssSquareButton onClick={() => {}} type="MORE" />
        }
        title="Service And Quota"
      >
        <div className="pa-3">
          <Row gutter={[12, 12]} className="service-and-usage">
            {selectedDataPack && (
              <Col span={8}>
                <BssContainer
                  titleComponent={
                    <Dropdown
                      menu={{ items:dataOptions ,onClick:onChangeDataPack}}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <BssSquareButton
                        onClick={() => {}}
                        type="DOWN_ARROW"
                      />
                    </Dropdown>
                  }
                  title="Data"
                >
                  <div className="pa-3">
                    <div className="package-name-title">                      
                      {selectedDataPack.name}
                    </div>
                    <div className="mt-2">
                       <DigitalBssText 
                          size='md'
                          style='semi-bold'
                          color="primary"
                       >
                          {selectedDataPack.totalQuantity + ' Total'}
                       </DigitalBssText>
                    </div>
                    <Progress
                      percent={parseInt(selectedDataPack.remainingPercentage)}
                      showInfo={false}
                      strokeColor={CssProperties.PRIMARY_COLOR_1}
                    />
                    <div className="remaining-count">
                      <DigitalBssText 
                          size='lg'
                          style='semi-bold'
                          color="primary"
                      >
                          {selectedDataPack.remainingQuantity + ' Remaining'}
                      </DigitalBssText>
                    </div>
                  </div>
                </BssContainer>
              </Col>
            )}

            <Col span={8}>
              <BssContainer
                titleComponent={
                <Dropdown
                      menu={{items:voiceOptions,onClick:onChangeVoicePack}}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <BssSquareButton
                        onClick={() => {}}
                        type="DOWN_ARROW"
                      />
                    </Dropdown>
                }
                title="Voice"
              >
                <div className="pa-3">
                  <div className="package-name-title">
                    {selectedVoicePack.name}
                  </div>
                    <div className="mt-2">
                       <DigitalBssText 
                          size='md'
                          style='semi-bold'
                          color="primary"
                       >
                          {selectedVoicePack.totalQuantity + ' Total'}
                       </DigitalBssText>
                    </div>
                  <Progress
                    percent={parseInt(selectedVoicePack.remainingPercentage)}
                    showInfo={false}
                    strokeColor={CssProperties.PRIMARY_COLOR_1}
                  />
                  <div className="remaining-count">
                    <DigitalBssText
                      size='lg'
                      style='semi-bold'
                      color="primary"
                    >
                      {selectedVoicePack.remainingQuantity + ' Remaining'}
                    </DigitalBssText>
                  </div>
                </div>
              </BssContainer>
            </Col>

            <Col span={8}>
              <BssContainer
                titleComponent={
                <Dropdown
                menu={{items:smsOptions,onClick:onChangeSmsPack}}
                trigger={["click"]}
                placement="bottomRight"
              >
                <BssSquareButton
                  onClick={() => {}}
                  type="DOWN_ARROW"
                />
              </Dropdown>
                }
                title="SMS"
              >
                <div className="pa-3">
                  <div className="package-name-title">
                    {selectedSMSPack.name}
                  </div>
                  <div className="mt-2">
                       <DigitalBssText 
                          size='md'
                          style='semi-bold'
                          color="primary"
                      >
                        {selectedSMSPack.totalQuantity + ' Total'}
                        </DigitalBssText>
                  </div>
                  <Progress
                    percent={parseInt(selectedSMSPack.remainingPercentage)}
                    showInfo={false}
                    strokeColor={CssProperties.PRIMARY_COLOR_1}
                  />
                  <div className="remaining-count">
                      <DigitalBssText 
                          size='lg'
                          style='semi-bold'
                          color="primary"
                      >
                        {selectedSMSPack.remainingQuantity + ' Remaining'}
                      </DigitalBssText>
                  </div>
                </div>
              </BssContainer>
            </Col>
          </Row>
        </div>
      </BssContainer>
    );
}

export default ServiceAndUsage;