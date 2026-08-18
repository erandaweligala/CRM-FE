
interface WebsiteItemProps {
    value?: string;
}

const WebsiteItem = ({value }: WebsiteItemProps) => {
    return (
            <a
                href={value ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    padding: "4px 12px",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "200px",
                }}
            >
                {value ?? "N/A"}
            </a>
    );
};
export default WebsiteItem;