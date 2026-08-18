import { Empty, DatePicker } from "antd";
import { FC } from "react";
import { Bar } from "react-chartjs-2";
import { CustomerEngagements } from "../../../../models/CustomerOverviewModel";
import "./Engagement.scss";

import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import dayjs from "dayjs";
import { BSS_Container } from "bss-component-library";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface EngagementProps {
    engagementData: CustomerEngagements[];
}

const { RangePicker } = DatePicker;

const Engagement: FC<EngagementProps> = ({ engagementData }) => {
    const today = dayjs();
    const yesterday = dayjs().subtract(1, "day");

    const data = {
      labels: engagementData?.map((item) => item.type) || [],
      datasets: [
          {
              label: "Service provider Initiated",
              data: engagementData?.map((item) => item.serviceProviderInitiated) || [],
              backgroundColor: "#E6C463",
              stack: "Stack 0",
          },
          {
              label: "Customer Initiated",
              data: engagementData?.map((item) => item.customerInitiated) || [],
              backgroundColor: "#A4A4D9",
              stack: "Stack 1",
          },
      ]
  };



    const config = {
        data: data,
        options: {
            plugins: {
                legend: {
                    position: "bottom" as const,
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: "circle",
                        font: { size: 13 },
                    },
                },
                tooltip: {
                    padding: 10,
                    backgroundColor: "#333",
                    titleFont: {  size: 14, weight: 600 },
                    bodyFont: {  size: 13 },
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: "#E0E0E0",
                        lineWidth: 1,
                    },
                    ticks: {
                        padding: 8,
                        font: { size: 12 },
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        padding: 8,
                        font: {size: 12 },
                    },
                },
            },
        },
    };

    return (
        <BSS_Container
            titleComponent={
                <RangePicker
                    format="DD-MM-YYYY"
                    defaultValue={[yesterday, today]}
                    onChange={() => console.log()}
                    style={{ width: 248, height: 24 }}
                />
            }
            title="Engagement"
            height="300px"
        >
            {!engagementData || engagementData.length === 0 ? (
                <div style={{ height: "100%" }} className="content-center-all-side">
                    <Empty className="mt-4 mb-3" />
                </div>
            ) : (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: "100%",
                    }}
                >
                    <div className="chart-container" style={{ width: "90%", height: "90%" }}>
                        <Bar {...config} id="engagement-bar-chart" />
                    </div>
                </div>
            )}
        </BSS_Container>
    );
};

export default Engagement;