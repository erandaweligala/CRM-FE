import {FC, useEffect, useRef, useState} from "react";
import "./MainMenu.scss";
import {Button, Dropdown, Menu, MenuProps} from "antd";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../store/main-store";
import {customerProfileAction} from "../../store/customer-profile.slice";
import {DownOutlined} from "@ant-design/icons";
import CENavIcon from "../../../src/assets/images/CENavbar.png";
import {logoutAndRedirectToLoginPage} from "../../services/authentication-logic.service";
import {hasPermissionToTheMenu} from "../../services/permission.service";
import MENU_PERMISSION from "../../constants/menu-permission";
import usersICON from "../../assets/images/User_Icon.svg";
import settingsICON from "../../assets/images/Settings_Icon.svg";
import INTERNAL_ROUTES from "../../constants/internal-routes.ts";
import Notification from "./components/notification/Notification.tsx";

const hasAnyPermission = (...permissions: any[]) => {
    return permissions.some(hasPermissionToTheMenu);
};

const buildCatalogItems = () => {
    if (!hasPermissionToTheMenu(MENU_PERMISSION.PRODUCT)) return null;

    const catalogChildren = [
        {label: "Product Management", key: "CREATE_PRODUCT"},
        {label: "Configuration", key: "PRODUCT_CATALOG_CONFIGURATION"},
        {
            label: "Federation Workflows",
            key: "PRODUCT_CATALOG_FEDERATION_WORKFLOW",
        },
        {label: "Federation Process", key: "PRODUCT_CATALOG_FEDERATION_PROCESS"},
        {label: "Service Catalog", key: "PRODUCT_CATALOG_SERVICE_CATALOG"},
        {label: "Resource Catalog", key: "RESOURCE_CATALOG"},
    ];

    return {
        label: "Catalog",
        key: "CATALOG",
        children: catalogChildren,
    };
};
const buildWorkflowItems = () => {
    if (!hasPermissionToTheMenu(MENU_PERMISSION.WORKFLOW)) return null;

    const workflowChildren = [
        {label: "Approval Workflow", key: "APPROVAL_WORKFLOW"},
        {label: "Create Approval Request", key: "CREATE_APPROVAL_REQUEST"},
        {
            label: "Approval Request Management",
            key: "APPROVAL_REQUEST_MANAGEMENT",
        },
    ];

    return {
        label: "Workflow",
        key: "WORKFLOW",
        children: workflowChildren,
    };
};
const buildCaseManagementItems = () => {
    if (!hasPermissionToTheMenu(MENU_PERMISSION.TROUBLE_TICKET)) return null;

    const caseManagementChildren = [
        {label: "Case Type", key: "CASE_TYPE"},
        {label: "Case Request Management", key: "CASE_REQUEST_MANAGEMENT"},
        {
            label: "Trouble Tickets",
            key: "TROUBLE_TICKET",
        },
    ];

    return {
        label: "Case",
        key: "TROUBLE_TICKET",
        children: caseManagementChildren,
    };
};
const buildMainMenuItems = (microFrontends: any[]): MenuProps["items"] => {
    const items: MenuProps["items"] = [];

    const addIfPermitted = (label: string, key: string, permission: any) => {
        if (hasPermissionToTheMenu(permission)) {
            items.push({label, key});
        }
    };

    addIfPermitted("Home", "HOME", MENU_PERMISSION.HOME);

    if (
        hasAnyPermission(
            MENU_PERMISSION.LEADS,
            MENU_PERMISSION.ACCOUNTS,
            MENU_PERMISSION.CONTACTS,
            MENU_PERMISSION.DEALS,
            MENU_PERMISSION.QUOTES
        )
    ) {
        addIfPermitted("Account", "ACCOUNTS", MENU_PERMISSION.ACCOUNTS);
        addIfPermitted("Contact", "CONTACTS", MENU_PERMISSION.CONTACTS);
        addIfPermitted("Lead", "LEADS", MENU_PERMISSION.LEADS);
        addIfPermitted("Opportunity", "DEALS", MENU_PERMISSION.DEALS);
    }

    addIfPermitted("Agreement", "CPQ_IFRAME", MENU_PERMISSION.PRODUCT);

    const catalog = buildCatalogItems();
    if (catalog) items.push(catalog);
    addIfPermitted("Customer", "CUSTOMER", MENU_PERMISSION.CUSTOMER);
    if (microFrontends.length > 0) {
        items.push({
            label: "Other",
            key: "Externals",
            children: microFrontends.map((mf) => ({
                label: mf.displayName,
                key: mf.componentName,
            })),
        });
    }
    const caseManagement=buildCaseManagementItems();
    const workflow = buildWorkflowItems();
    if (caseManagement) items.push(caseManagement);
    if (workflow) items.push(workflow);
    return items;
};

const MainMenu: FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [current, setCurrent] = useState("HOME");
    const loggedInUserName = useAppSelector(
        (state) => state.auth.decodedToken?.name
    );
    const microFrontends = useAppSelector(
        (state) => state.metaData.microFrontendComponentList
    );
    const [activeDropdown, setActiveDropdown] = useState<
        "SYSTEM" | "USER" | null
    >(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const items: MenuProps["items"] = buildMainMenuItems(microFrontends) || [];
    const [menuWidth, setMenuWidth] = useState<number>(500);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setActiveDropdown]);

    useEffect(() => {
        const updateMenuWidth = () => {
            const windowWidth = window.innerWidth;
            const calculatedWidth = Math.max(300, Math.min(0.6 * windowWidth, 900));
            setMenuWidth(calculatedWidth);
        };
        updateMenuWidth();
        window.addEventListener("resize", updateMenuWidth);
        return () => window.removeEventListener("resize", updateMenuWidth);
    }, []);

    const handleMenuClick = (selectedMenuDetails: { key: string }) => {
        const menuMapping: Record<string, string> = {
            HOME: INTERNAL_ROUTES.HOME_PAGE,
            CUSTOMER: INTERNAL_ROUTES.CUSTOMER,
            CUSTOMER_PROFILE: INTERNAL_ROUTES.CUSTOMER_PROFILE,
            ACTION_LOGS: INTERNAL_ROUTES.ACTION_LOGS,
            USER_MANAGEMENT: INTERNAL_ROUTES.USERS,
            ROLES: INTERNAL_ROUTES.ROLES,
            PERMISSIONS: INTERNAL_ROUTES.PERMISSIONS,
            EXTENSIONS: INTERNAL_ROUTES.EXTENSIONS,
            CONFIGURATIONS: INTERNAL_ROUTES.CONFIGURATIONS,
            CPQ_HOME: INTERNAL_ROUTES.CPQ_HOME,
        };

        const route = menuMapping[selectedMenuDetails.key];

        if (route) {
            dispatch(customerProfileAction.clearStore());
            navigate(route);
        }
        setCurrent(selectedMenuDetails.key);
        setActiveDropdown(null);
    };

    const buildMenuItems = (menuType: "SYSTEM" | "USER") => {
        const menuItems: { label: string; key: string }[] = [];

        if (menuType === "SYSTEM") {
            if (hasPermissionToTheMenu(MENU_PERMISSION.AUDIT_LOG)) {
                menuItems.push({label: "Action Logs", key: "ACTION_LOGS"});
            }
            if (hasPermissionToTheMenu(MENU_PERMISSION.PERMISSIONS)) {
                menuItems.push({label: "Extension", key: "EXTENSIONS"});
            }
            if (hasPermissionToTheMenu(MENU_PERMISSION.PERMISSIONS)) {
                menuItems.push({label: "Configurations", key: "CONFIGURATIONS"});
            }
        } else if (menuType === "USER") {
            if (hasPermissionToTheMenu(MENU_PERMISSION.USERS)) {
                menuItems.push({label: "Users", key: "USER_MANAGEMENT"});
            }
            if (hasPermissionToTheMenu(MENU_PERMISSION.ROLES)) {
                menuItems.push({label: "Roles", key: "ROLES"});
            }
            if (hasPermissionToTheMenu(MENU_PERMISSION.PERMISSIONS)) {
                menuItems.push({label: "Permissions", key: "PERMISSIONS"});
            }
        }

        return menuItems;
    };

    const onClick = (selectedMenuDetails: { key: string }) => {
        const menuActions: Record<string, () => void> = {
            HOME: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.HOME_PAGE);
            },
            CUSTOMER: () => navigate(INTERNAL_ROUTES.CUSTOMER),
            CUSTOMER_PROFILE: () => navigate(INTERNAL_ROUTES.CUSTOMER_PROFILE),
            ACTION_LOGS: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.ACTION_LOGS);
            },
            USER_MANAGEMENT: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.USERS);
            },
            ROLES: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.ROLES);
            },
            PERMISSIONS: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.PERMISSIONS);
            },
            ACCOUNTS: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.ACCOUNTS);
            },
            CONTACTS: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.CONTACTS);
            },
            LEADS: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.LEADS);
            },
            DEALS: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.OPPORTUNITIES);
            },
            CPQ_HOME: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.CPQ_HOME);
            },
            EXTENSIONS: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.EXTENSIONS);
            },
            CONFIGURATIONS: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.CONFIGURATIONS);
            },
            PRODUCT: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.PRODUCTS);
            },
            CREATE_PRODUCT: () => navigate(INTERNAL_ROUTES.CREATE_PRODUCT),
            PRODUCT_CATALOG_CONFIGURATION: () =>
                navigate(INTERNAL_ROUTES.PRODUCT_CONFIGURATION),
            PRODUCT_CATALOG_FEDERATION_PROCESS: () =>
                navigate(INTERNAL_ROUTES.PRODUCT_FEDERATION_PROCESS),
            PRODUCT_CATALOG_FEDERATION_WORKFLOW: () =>
                navigate(INTERNAL_ROUTES.PRODUCT_FEDERATION_WORKFLOW),
            PRODUCT_CATALOG_SERVICE_CATALOG: () =>
                navigate(INTERNAL_ROUTES.PRODUCT_SERVICE_CATALOG),
            RESOURCE_CATALOG: () =>
                navigate(INTERNAL_ROUTES.PRODUCT_RESOURCE_CATALOG),
            CPQ_IFRAME: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.CPQ_IFRAME);
            },
            WORKFLOW: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.WORKFLOW);
            },
            APPROVAL_WORKFLOW: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.APPROVAL_WORKFLOW);
            },
            CREATE_APPROVAL_REQUEST: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.CREATE_APPROVAL_REQUEST);
            },
            APPROVAL_REQUEST_MANAGEMENT: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.APPROVAL_REQUEST_MANAGEMENT);
            },
            CASE_TYPE: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.CASE_TYPE);
            },
            CASE_REQUEST_MANAGEMENT: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.CASE_REQUEST_MANAGEMENT);
            },
            TROUBLE_TICKET: () => {
                dispatch(customerProfileAction.clearStore());
                navigate(INTERNAL_ROUTES.TROUBLE_TICKET);
            },
        };

        if (menuActions[selectedMenuDetails.key]) {
            menuActions[selectedMenuDetails.key]();
        } else if (
            microFrontends.some(
                (singleMf) => selectedMenuDetails.key === singleMf.componentName
            )
        ) {
            dispatch(customerProfileAction.clearStore());
            navigate(
                INTERNAL_ROUTES.DYNAMIC_EXTENSION + `/${selectedMenuDetails.key}`
            );
        }

        setCurrent(selectedMenuDetails.key);
    };

    const nameLabels: MenuProps["items"] = [
        {
            key: "3",
            label: (
                <button
                    style={{
                        width: 80,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                    }}
                    onClick={logoutAndRedirectToLoginPage}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            logoutAndRedirectToLoginPage();
                        }
                    }}
                >
                    Logout
                </button>
            ),
        },
    ];

    return (
        <div className="main-menu-container">
            <div className="logo-container content-center-all-side mx-3">
                <img className="logo" src={CENavIcon} alt="Logo"/>
            </div>
            <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
                style={{width: menuWidth}}
            />
            <div
                className="logout-notification-settings"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "16px",
                    paddingRight: "20px",
                    height: "56px",
                }}
            >
        <span
            className="dbss-square-button"
            style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                color: "white",
                cursor: "pointer",
            }}
        >
          <Button
              type="default"
              onClick={() => {
                  if (hasPermissionToTheMenu(MENU_PERMISSION.PERMISSIONS)) {
                      navigate(INTERNAL_ROUTES.CONFIGURATIONS);
                  } else {
                      setActiveDropdown(
                          activeDropdown === "SYSTEM" ? null : "SYSTEM"
                      );
                  }
              }}
              style={{backgroundColor: "transparent"}}
          >
            <img className="icon" src={settingsICON} alt="Button Icon"/>
          </Button>
        </span>

                <Dropdown
                    menu={{
                        items: buildMenuItems(activeDropdown ?? "USER"),
                        onClick: ({key}) => handleMenuClick({key}),
                    }}
                    trigger={["click"]}
                    placement="bottomRight"
                    open={!!activeDropdown}
                    onOpenChange={(open) =>
                        setActiveDropdown(open ? activeDropdown : null)
                    }
                >
                    <button
                        type="button"
                        className="dbss-square-button"
                        aria-pressed={activeDropdown === "USER"}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            borderRadius: "4px",
                            color: "white",
                            cursor: "pointer",
                            border: "none",
                            padding: 0,
                        }}
                        onClick={() =>
                            setActiveDropdown(activeDropdown === "USER" ? null : "USER")
                        }
                    >
                        <img className="icon" src={usersICON} alt="User"/>
                    </button>
                </Dropdown>

                <Notification/>

                <Dropdown
                    menu={{items: nameLabels}}
                    trigger={["click"]}
                    placement="bottomCenter"
                >
                    <div
                        className="name-label"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            borderRadius: "4px",
                            padding: "5px 12px",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
            <span style={{fontSize: "14px", marginRight: "6px"}}>
              {loggedInUserName}
            </span>
                        <DownOutlined style={{fontSize: "12px"}}/>
                    </div>
                </Dropdown>

            </div>
        </div>
    );
};
export default MainMenu;

