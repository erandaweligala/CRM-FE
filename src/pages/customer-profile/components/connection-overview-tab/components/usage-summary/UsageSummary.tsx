import {FC} from "react";
import {Doughnut} from "react-chartjs-2";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import {UsageSummaryModel} from "../../../../models/ConnectionOverviewModel";
import "./UsageSummary.scss"
import { BSS_Container, BSS_SquareButton } from "bss-component-library";

ChartJS.register(ArcElement, Tooltip, Legend);

interface UsageSummaryProps {
    data: UsageSummaryModel[]
}

const UsageSummary: FC<UsageSummaryProps> = () => {

    const dummyData = {
        labels: ['Facebook', 'Youtube', 'Microsoft', 'Netflix', 'Other'],
        datasets: [
            {
                label: 'Used GB',
                data: [12, 19, 3, 5, 2],
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ]
            },
        ],
    };

    return (
        <BSS_Container
            titleComponent={<BSS_SquareButton onClick={() => {}} type="CALENDER"/>}
            title="Product Summary"
            height="250px"
        >
            <div className="usage-summary pa-3 h-100">
                <div className="content-center-all-side" style={{height: "90%"}}>
                    <div className="chart-container" style={{width: '400px'}}>
                        <Doughnut
                            data={dummyData}
                            options={{
                                plugins: {
                                    legend: {
                                        position: 'left' as const,
                                    },
                                },
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                </div>
                <div className="content-date mb-4">
                    <div className="summery-date content-center-horizontal font-sm-semi-bold pa-3">
                        2023/02/01 - 2023/02/28
                    </div>
                </div>
            </div>

        </BSS_Container>
    )
}

export default UsageSummary;