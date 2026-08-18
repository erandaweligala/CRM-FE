import { FC } from "react";
import { Doughnut } from "react-chartjs-2";
import { DatePicker, Empty } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import "./TicketsByCategory.scss";
import "antd/dist/reset.css";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  ArcElement,
} from "chart.js";
import dayjs from "dayjs";
import { BSS_Container, BSS_SquareButton } from "bss-component-library";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const {RangePicker} = DatePicker;

const colorPalette = [
    "#A4A4D9",
    "#71ABDD",
    "#FFC75F",
    "#84DCC6",
    "#FF6F91",
    "#D65DB1",
    "#845EC2",
];

const TicketsByCategory: FC<{ data: { category: string; value: number }[] }> = ({
                                                                                    data,
                                                                                }) => {
    const today = dayjs();
    const yesterday = dayjs().subtract(1, 'day');

    const handleDateChange: RangePickerProps["onChange"] = (_, dateStrings) => {
        console.log(dateStrings);
    };

    if (!data || data.length === 0) {
        return (
            <BSS_Container
                title="Tickets By Category"
                titleComponent={<BSS_SquareButton type="MORE"/>}
                height="300px"
            >
                <div className="content-center-all-side" style={{height: "100%"}}>
                    <Empty className="mt-4 mb-3"/>
                </div>
            </BSS_Container>
        );
    }

    const graphDataFormat = {
        labels: data.map((item) => item.category),
        datasets: [
            {
                data: data.map((item) => item.value),
                backgroundColor: data.map((_, index) => colorPalette[index % colorPalette.length]),
                borderWidth: 2,
                hoverBorderColor: "#fff",
            },
        ],
    };

    return (
        <BSS_Container
            title="By Category"
            titleComponent={
                <RangePicker
                    format="DD-MM-YYYY"
                    defaultValue={[yesterday, today]}
                    onChange={handleDateChange}
                    style={{width: 248, height: 24}}
                />
            }
            height="300px"
        >
            <div className="chart-container" style={{
                width: "100%",
                maxWidth: "900px",
                height: "90%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "15px"
            }}>
                <Doughnut
                    data={graphDataFormat}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "right",
                                labels: {
                                    boxWidth: 14,
                                    boxHeight: 14,
                                    padding: 12,
                                    color: "#4A4A4A",
                                    font: {size: 12, weight: 500},
                                },
                            },
                            tooltip: {
                                backgroundColor: "rgba(0, 0, 0, 0.75)",
                                titleFont: {size: 14, weight: "bold"},
                                bodyFont: {size: 12, weight: "normal"},
                                padding: 10,
                            },
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true,
                        },
                    }}
                />
            </div>
        </BSS_Container>
    );
};

export default TicketsByCategory;