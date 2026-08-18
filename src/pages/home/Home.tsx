import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Button, Spin } from "antd";
import { ArrowUpOutlined, LoadingOutlined } from "@ant-design/icons";
import ActionPermission from "../../components/access-control/action-permission/ActionPermission";
import ACTION_PERMISSION from "../../constants/action-permission";
import { RootState, useAppSelector } from "../../store/main-store";
import DashboardProperties from "../../configs/dashboard-properties";
import { getDashboardId, getGuestToken } from "./services/Home.services";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import showNotification from "../../services/notification.service";
import "./Home.scss"
import NoDashboard from "../../components/no-dashboard/NoDashboard";
import { BSS_Breadcrumb as BssBreadcrumb } from "bss-component-library";

const validateToken = (token: string): boolean => {
    try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < now) {
            showNotification("ERROR", "Token has expired");
            return false;
        }
        return true;
    } catch (err) {
        showNotification("ERROR", "Token decode failed: " + err);
        return false;
    }
};

const Home: FC = () => {
    const user = useAppSelector((state: RootState) => state.auth.decodedToken?.sub);
    const userName = useAppSelector((state: RootState) => state.auth.decodedToken?.name);
    const userDashboardID = useAppSelector((state: RootState) =>
        state.auth.decodedToken?.customProperties?.find(prop => prop.propertyName === "Home Dashboard")?.valueId ?? null
    );
    const supersetContainerRef = useRef<HTMLDivElement | null>(null);

    const [loading, setLoading] = useState(true);
    const [showButton, setShowButton] = useState(false);
    const [embedToken, setEmbedToken] = useState<string | null>(null);
    const [dashboardId, setDashboardId] = useState<string | null>(null);


    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            setShowButton(scrollHeight - scrollTop <= clientHeight + 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const embed = useCallback(async (token: string, id: string) => {
        try {
            const supersetUrl = import.meta.env.MODE === "development"
                ? DashboardProperties.supersetDevUrl
                : DashboardProperties.supersetDemoUrl;
            if (!supersetContainerRef.current) {
                showNotification("ERROR", "Dashboard container not found.");
                return;
            }
            await embedDashboard({
                id: id,
                supersetDomain: supersetUrl,
                mountPoint: supersetContainerRef.current,
                fetchGuestToken: async () => token,
                dashboardUiConfig: {
                    hideTitle: true,
                    hideChartControls: true,
                    filters: { expanded: false },
                    urlParams: { standalone: true, user },
                },
            });

            const iframe = document.querySelector("iframe");
            if (iframe) {
                iframe.style.cssText = "height: 180vh; width: 100%; border: none;";
            }
            setLoading(false);
        } catch (err) {
            console.error("Dashboard embed error:", err);
            showNotification("ERROR", "Dashboard embed failed: " + err);
            setLoading(false);
        }
    }, [user]);

    const initializeDashboard = useCallback(async () => {
        if (!userDashboardID) return;
        setLoading(true);
        const id = await getDashboardId(userDashboardID);
        if (!id) return;
        const token = await getGuestToken({ dashboardID: id });
        if (token?.token && validateToken(token.token)) {
            setDashboardId(id);
            setEmbedToken(token.token);
        } else {
            showNotification("ERROR", "Invalid or missing guest token");
        }
    }, [userDashboardID]);

    useEffect(() => {
        if (!embedToken || !dashboardId || !supersetContainerRef.current) return;
        embed(embedToken, dashboardId);
    }, [embedToken, dashboardId, embed]);

    useEffect(() => {
        initializeDashboard();

        const interval = setInterval(() => {
            initializeDashboard();
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [initializeDashboard]);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    return (
        <>
            <BssBreadcrumb>
                <BssBreadcrumb.Section>CRM</BssBreadcrumb.Section>
                <BssBreadcrumb.Section>Home</BssBreadcrumb.Section>
            </BssBreadcrumb>
            
            <ActionPermission action={ACTION_PERMISSION.DISPLAY_HOME_PAGE}>
                <div style={{ paddingLeft: "42px", paddingRight: "43px", paddingTop: "24px" }}>
                    {userDashboardID ? (
                        <>
                            <span style={{
                                fontFamily: "Poppins, sans-serif",
                                fontSize: 18,
                                color: "#000000",
                                textAlign: "left",
                                fontWeight: 400,
                                lineHeight: "21px",
                                opacity: 1,
                            }}>Hello, {userName}! Welcome to the </span>
                            <span
                                style={{
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: 18,
                                    color: "#000000",
                                    textAlign: "left",
                                    fontWeight: 600,
                                    lineHeight: "21px",
                                    opacity: 1,
                                }}
                            >
                                Sales Dashboard
                            </span>

                            <div
                                style={{
                                    position: "relative",
                                    overflow: "hidden",
                                    border: "1px solid #00000015",
                                    marginTop: "20px",
                                }}
                                aria-busy={loading}
                            >
                                {loading && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                                            zIndex: 1000,
                                        }}
                                    >
                                        <Spin
                                            indicator={
                                                <LoadingOutlined
                                                    style={{
                                                        fontSize: 48,
                                                        color: "#264653",
                                                        position: "relative",
                                                        top: "-100px",
                                                    }}
                                                    spin
                                                />
                                            }
                                        />
                                    </div>
                                )}

                                <div
                                    ref={supersetContainerRef}
                                    style={{
                                        width: "100%",
                                        height: "180vh",
                                        visibility: loading ? "hidden" : "visible",
                                    }}
                                ></div>

                            </div>

                            {showButton && (
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<ArrowUpOutlined />}
                                    size="large"
                                    onClick={scrollToTop}
                                    style={{
                                        position: "fixed",
                                        bottom: 50,
                                        right: 30,
                                        zIndex: 1000,
                                        backgroundColor: "#264653",
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(37, 117, 252, 0.4)",
                                        color: "#fff",
                                    }}
                                />
                            )}
                        </>
                    ) : (
                        <div
                            style={{
                                height: "247px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                marginTop: "66px",
                            }}
                        >
                            <NoDashboard description="No dashboard has been assigned to you. Please contact your administrator to get access." />
                        </div>
                    )}
                </div>
            </ActionPermission>
        </>
    );
};

export default Home;