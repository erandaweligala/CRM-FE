import {FC} from "react";
import {Doughnut} from "react-chartjs-2";
import "../tickets-by-category/TicketsByCategory.scss"
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip, ArcElement} from "chart.js";
import { BSS_Container as BssContainer} from "bss-component-library";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface ConnectionsProps {
    data: {
        type: string;
        value: number;
    }[]
}

const Connections: FC<ConnectionsProps> = ({data}) => {

    const graphDataFormat = {
        labels: data.map((singleConnection) => singleConnection.type),
        datasets: [
            {
                label: 'Connection Count',
                data: data.map((singleConnection) => singleConnection.value),
                backgroundColor: [  " #A4A4D9"," #71ABDD"," #FFC75F"," #84DCC6"," #FF6F91"," #D65DB1"," #845EC2",]
            },
        ],
    };

    return (
        <BssContainer
            title="Connection"
            height="300px"
        >
    <div className="chart-container" style={{ width: "79%",maxWidth:"900px", height: "90%",display: "flex", justifyContent: "center", alignItems: "center", margin: "15px" }}>
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
                  font: { size: 12, weight: 500 },
                },
              },
              tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                titleFont: { size: 14, weight: "bold" },
                bodyFont: { size: 12, weight: "normal" },
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

        </BssContainer>
    )
}

export default Connections;