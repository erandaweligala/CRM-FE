import {Button, Popover} from "antd";
import NotificationImage from "../../../../assets/images/notification.svg";
import "./notification.scss"
import {useEffect, useState} from "react";
import SingleNotification from "./models/SingleNotification.ts";
import {getAllNotification, newNotification} from "./services/backend-notification.service.ts";
import dayjs from "dayjs";
import showNotification from "../../../../services/notification.service.tsx";
import NotificationIcon from '../../../../assets/images/notification_icon.svg?react';

import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

export const BASE_PATH = import.meta.env.VITE_BASE_PATH;

const notificationPullTimeInSeconds = 5000;
const notificationCountPerOnePull = 100; // itemPerPage

const Notification = () => {

    const [totalNotification, setTotalNotification] = useState<SingleNotification[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [totalPagesLoaded, setTotalPagesLoaded] = useState<number>(0); // is 1 page API loaded then value is 1


    const popOverOpenCloseHandler = (open: boolean) => {
        if (open) {
            getAllNotificationList();
        } else {
            setTotalNotification([]);
            setTotalRecords(0);
            setTotalPagesLoaded(0);
        }
    }

    const loadNewNotification = async () => {
        newNotification(notificationPullTimeInSeconds).then((newNotifications) => {
            if(newNotifications.length === 1) {
                showNotification("INFO", `You have one new ${newNotifications[0].title} notification.`);
            } else if (newNotifications.length > 0) {
                showNotification("INFO", `You have ${newNotifications.length} new notifications.`);
            }
        })
    }

    const getAllNotificationList = async () => {
        getAllNotification(totalPagesLoaded, notificationCountPerOnePull).then(([notificationList, totalNumberOfNotification]) => {
            setTotalNotification((prevNotification) => {
                return [...prevNotification, ...notificationList]
            });
            setTotalPagesLoaded((prevPage) => prevPage + 1);
            setTotalRecords(totalNumberOfNotification);
        })
    }

    useEffect(() => {
        const intervalTimerId = setInterval(() => {
            loadNewNotification()
        }, notificationPullTimeInSeconds * 1000);
        return () => {
            clearInterval(intervalTimerId);
        }
    }, []);

    const getNotificationContent = () => {
        return (
            <div className="notification-content">
                {totalNotification.length > 0 &&
                    totalNotification.map((singleNotification) => {
                        return (
                            <div className="single-notification" key={singleNotification.id}>
                                <div className="mr-3">
                                    <NotificationIcon/>
                                </div>
                                <div>
                                    <div className="title">
                                        {/*<InfoCircleOutlined*/}
                                        {/*    style={{fontSize: 16, color: "blue"}}*/}
                                        {/*    className="mr-2"*/}
                                        {/*/>*/}
                                        {singleNotification.title}
                                    </div>
                                    <div className="message">
                                        {singleNotification.message}
                                    </div>
                                    <a href={BASE_PATH + singleNotification.frontUrl} target="_blank"
                                       rel="noopener noreferrer">
                                        Link
                                    </a>
                                    {/*<div>{dayjs(singleNotification.dateTime).format("YYYY MMM DD, hh:mm A")}</div>*/}
                                    <div className="time">{dayjs(singleNotification.dateTime).fromNow()}</div>
                                </div>
                            </div>
                        )
                    })}
                {
                    totalRecords > (totalNotification.length + 1) &&
                    <div className="text-align-center">
                        <Button type="link" onClick={getAllNotificationList}>Load More</Button>
                    </div>
                }
                {
                    totalNotification.length === 0 && totalRecords === 0 &&
                    <div className="no-notification">You have no new notifications.</div>
                }
            </div>
        )
    }

    return (
        <span className="dbss-square-button notification">
            <Popover
                trigger="click"
                placement="topRight"
                content={getNotificationContent()}
                arrow={false}
                overlayInnerStyle={{backgroundColor: "#FFFFFF", padding: 0}}
                onOpenChange={popOverOpenCloseHandler}
            >
              <Button
                  type="default"
                  onClick={() => {

                  }}
                  style={{backgroundColor: "transparent"}}
              >
                <img src={NotificationImage} alt="Notification"/>
              </Button>
            </Popover>
        </span>
    )
}

export default Notification;