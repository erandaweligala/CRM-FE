import {FC} from "react";
import {Line} from 'react-chartjs-2';
import DigitalBssText_Temp from "../../../../../../components/DigitalBssText/DigitalBssText"

import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip, ArcElement, LineController, LineElement, PointElement} from "chart.js";
import { BSS_Container } from "bss-component-library";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineController,
    LineElement,
    PointElement
);


interface AverageRevenueProps {
    data: {
        month: string;
        value: number
    }[]
}

const AverageRevenue: FC<AverageRevenueProps> = ({data}) => {

    if (!data) {
        return (
            <BSS_Container
                title="Average Revenue Per User (ARPU)"
                height="250px"
            >
                <div style={{height: "100%", color: "red"}} className="content-center-all-side">
                    <DigitalBssText_Temp 
                        size='lg'
                        style='semi-bold'
                        children= 'Old API Not Supporting'
                        color="primary"
                    />
                </div>

            </BSS_Container>
        )
    }

    const graphDataFormat = {
        labels: data.map((singleMonthRevenue) => singleMonthRevenue.month),
        datasets: [
            {
                label: 'Revenue',
                data: data.map((singleMonthRevenue) => singleMonthRevenue.value),
                borderColor: '#678EF2',
                backgroundColor: '#71ABDD',
            },
        ],
    };

    return (
        <BSS_Container
            title="Average Revenue Per User (ARPU)"
            height="300px"
        >
            <div className="usage-summary pa-3 h-100">
                <div className="content-center-all-side h-100">
                    <div className="chart-container" style={{width: "100%"}}>
                        <Line
                            id="average-revenue-line-chart"
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "bottom"
                                    },
                                },
                            }}
                            data={graphDataFormat}
                        />
                    </div>
                </div>
            </div>

        </BSS_Container>
    )
}

export default AverageRevenue;