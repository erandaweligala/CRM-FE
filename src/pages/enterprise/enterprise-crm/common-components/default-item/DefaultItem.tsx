
interface DefaultItemProps {
    label: string;
    value: string;
}

const DefaultItem = ({ label, value }: DefaultItemProps) => {
    return (
        <span
            style={{
                padding: "4px 12px",
                display: "inline-block",
                whiteSpace: "normal",
                overflowWrap: "break-word",
                textOverflow: "ellipsis",
                maxWidth: label === "Description" ? "850px" : "350px",
                wordBreak: "break-word",
            }}
        >
            {(() => {
                let displayValue = "N/A";
                if (value) {
                    displayValue = label === "Description" ? value.slice(0, 1000) : value.slice(0, 50);
                }
                return displayValue;
            })()}
        </span>
    );
};
export default DefaultItem;