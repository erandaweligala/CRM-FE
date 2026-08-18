import { DatePicker, Empty } from "antd"; // Import Empty
import { FC, useEffect, useState } from "react";
import "./CustomerTimeLine.scss";
import dayjs from "dayjs";
import { CustomerTimelineRequestModel, TimelineDisplayModel } from "./models/CustomerTimelineModel";
import { getCustomerTimelineData } from "./services/customer-timeline.services";
import type { Dayjs } from "dayjs";
import { SearchPanelModel } from "../../../../models/SearchPanel.model";
import { BSS_Container } from "bss-component-library";

const { RangePicker } = DatePicker;

interface CustomerTimelineProps {
  searchPanelData: SearchPanelModel;
}

const generateTimeline = async (interactions: any[], startDate: string, endDate: string) => {
  const [start, end] = [dayjs(startDate).startOf("day"), dayjs(endDate).endOf("day")];
  const totalDays = end.diff(start, "day") + 1;

  const days = Array.from({ length: totalDays }, (_, i) => {
    const currentDate = start.clone().add(i, "day");
    const formattedDate = currentDate.format("YYYY-MM-DD");
    const dayInteractions = interactions.filter((interaction) => {
      const interactionDate = dayjs(interaction.interactionDate);
      return interactionDate.isSame(currentDate, "day");
    });
    return { id: formattedDate, date: formattedDate, interactionTypes: dayInteractions };
  });
  const allEmpty = days.every(day => (day.interactionTypes ?? []).length === 0);
  if (allEmpty) {
    return [];
  }

  console.log("days", days);
  return days;
};


const CustomerTimeline: FC<CustomerTimelineProps> = ({ searchPanelData }) => {
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);
  type RangeValue = [Dayjs | null, Dayjs | null] | null;

  const defaultDateRange: RangeValue = [dayjs(sixMonthsAgo), dayjs(today)];
  const [customerTimelineData, setCustomerTimelineData] = useState<TimelineDisplayModel[]>([]);
  const [value, setValue] = useState<RangeValue>(defaultDateRange);

  useEffect(() => {
    if (value) {
      const fromDate = dayjs(value[0]).format("YYYY-MM-DD");
      const toDate = dayjs(value[1]).endOf("month").format("YYYY-MM-DD");
      fetchCustomerTimeline(fromDate, toDate);
    }
  }, [value]);

  const fetchCustomerTimeline = async (fromD: string, toD: string) => {
    if (searchPanelData) {
      const payload: CustomerTimelineRequestModel = {
        fromDate: fromD,
        toDate: toD,
        searchType:
          searchPanelData.serviceReferenceType === "customerIdentification"
            ? searchPanelData.customerIdentificationType
            : searchPanelData.serviceReferenceType,
        searchValue: searchPanelData.serviceReferenceValue,
      };

      const response = await getCustomerTimelineData(payload);

      if (response) {
        const formattedResponse = await generateTimeline(response, fromD, toD);
        setCustomerTimelineData(formattedResponse);
      } else {
        setCustomerTimelineData([]);
      }
    }
  };

  const renderTimeline = () => {
    if (customerTimelineData.length === 0) {
      return (
        <div className="empty-container">
          <Empty
            description="No data available for the selected date range. Please adjust the range or check back later."
          />
        </div>
      );
    }

    return (
      <div className="timeline-wrapper">
        <div className="timeline-line-container">
          <div className="timeline-item">
            <div className="timeline-dot start-dot"></div>
            <div className="timeline-start-date-card below">
              <p>
                <strong>Start Date:</strong> {value?.[0]?.startOf("day").format("DD MMM YYYY")}
              </p>
            </div>
          </div>
          <div className="timeline-line">
            {customerTimelineData.map((item, index) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-dot"></div>
                {(item.interactionTypes ?? []).length > 0 && (
                  <div className={`timeline-card ${index % 2 === 0 ? "below" : "above"}`}>
                    <h4>{item.interactionTypes?.[0]?.interactionType || "No Interactions"}</h4>
                    <p>
                      <strong>Date:</strong> {item.date}
                    </p>
                    <p>
                      <strong>ID:</strong> {item.interactionTypes?.[0]?.id || "No ID"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="timeline-item">
            <div className="timeline-dot end-dot"></div>
            <div className="timeline-end-date-card below">
              <p>
                <strong>End Date:</strong> {value?.[1]?.endOf("day").format("DD MMM YYYY")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BSS_Container
      title="Customer Timeline"
      className="customer-time-line"
      titleComponent={
        <RangePicker
          allowClear={false}
          defaultValue={[dayjs(sixMonthsAgo), dayjs(today)]}
          onChange={(val) => setValue(val)}
          style={{ width: "248px", height: "24px" }}
        />
      }
    >
      {renderTimeline()}
    </BSS_Container>
  );
};

export default CustomerTimeline;