import { Button, Col, Form, Row, Input, Checkbox } from "antd";
import { FC, useEffect } from "react";
import "./Login.scss";
import { v4 as uuidv4 } from 'uuid';

import LoginImage from "../../../src/assets/images/LoginPageImage.png";
import DigitalTelco from "../../../src/assets/images/CustomerExpLogin.png";
import HandWaving from "../../../src/assets/images/HandWaving.png";
import { useAppSelector } from "../../store/main-store";
import { useNavigate } from "react-router-dom";
import INTERNAL_ROUTES from "../../constants/internal-routes";
import { FormInputErrorMessages } from "../../constants/form-input-error-messages.ts";
import { LocalStorageConstants } from "../../constants/local-storage.ts";

const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
const redirect_uri = import.meta.env.VITE_KEYCLOAK_SUCCESS_URL;
const keycloakUrl = import.meta.env.VITE_KEYCLOAK_END_POINT;

const Login: FC = () => {

   const isLogin = useAppSelector((state) => state.auth.isUserLogin);
   const rememberTenant = localStorage.getItem(LocalStorageConstants.TENANT_ID);
   const [loginForm] = Form.useForm();
   const navigate = useNavigate();

   useEffect(() => {
      if (isLogin) {
         navigate(INTERNAL_ROUTES.HOME_PAGE);
      } else {
         const lastLoginTenant = localStorage.getItem(LocalStorageConstants.TENANT_ID);
         if (lastLoginTenant) {
            loginForm.setFieldsValue({ tenant: lastLoginTenant });
         }
      }
   }, [isLogin]);

   const onLogin = (formValues: { tenant: string ,remember:boolean}) => {
      const state = uuidv4();
      const nonce = uuidv4();
      const tenant = formValues.tenant;
      const url = `${keycloakUrl}/realms/${tenant}/protocol/openid-connect/auth?client_id=${clientId}&response_type=code&scope=openid&redirect_uri=${redirect_uri}&state=${state}&nonce=${nonce}`;
      if (formValues.remember){
         localStorage.setItem(LocalStorageConstants.TENANT_ID, tenant);
      }
      
      window.location.replace(url);
   };

   return (
      <div className="login-page">
         <Row gutter={[0, 0]}>
            <Col xs={24} sm={24} md={14} lg={14} xl={14} className="image-wrapper content-center-all-side">
               <img src={LoginImage} alt="LoginImage" width={"100%"} className="leftImg" />
            </Col>

            <Col xs={24} sm={24} md={10} lg={10} xl={10} className="details-container content-center-all-side">
               <div  style={{marginLeft:80,marginRight:80}}>
                  <div style={{ paddingBottom: "47px" }}>
                     <div style={{ marginBottom: "40px" }}>
                        <img src={DigitalTelco} alt="digital-telco" style={{ maxHeight: "17vh", height: "40px" }} />
                     </div>

                     <div className="content-center-vertical">
                        <img src={HandWaving} alt="hand-waving" width={25} height={25} />
                        <span className="hello-there" style={{ paddingLeft: "10px",fontSize:"20px/30px" }}>{"Hello there,"}</span>
                     </div>
                     <div className="content-center-vertical">
                        <span className="welcome-to" style={{fontSize:"24px"}}>{"Welcome to "}</span>
                        <span className="digital-telco"style={{fontSize:"24px"}}>{" Customer Explore"}</span>
                     </div>
                  </div>

                  <Form form={loginForm} layout="vertical" onFinish={onLogin}>
                      <Form.Item
                        name="tenant"
                        label="Enter Tenant Name"
                        rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
                      >
                        <Input placeholder="Enter Tenant" />
                      </Form.Item>
                      <Form.Item>
                      <div style={{ marginTop: "-20px" }}>
                           <Form.Item name="remember" valuePropName="checked" initialValue={rememberTenant} noStyle>
                             <Checkbox style={{ marginRight: "8px" }}/>
                           </Form.Item>
                           <span>Remember my choice</span>
                        </div>
                      </Form.Item>

                     <Button type="primary" htmlType="submit" className="w-100 login-btn" style={{marginTop:"-29px"}}>
                        Continue
                     </Button>
                  </Form>
               </div>
            </Col>
         </Row>
      </div>
   );
};

export default Login;