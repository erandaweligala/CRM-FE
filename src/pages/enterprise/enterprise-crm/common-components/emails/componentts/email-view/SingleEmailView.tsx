import { FC } from "react";
import { Descriptions } from "antd";
import { EmailModel } from "../../models/EmailModel";

interface SingleEmailViewProps {
    clickedItem: EmailModel;
}

const SingleEmailView: FC<SingleEmailViewProps> = ({ clickedItem }) => {
    const sanitizeHTML = (html: string) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const textContent = doc.body.textContent || "";
        const sanitizedHTML = doc.body.innerHTML;
        return { textContent, sanitizedHTML };
    };

    const formatRecipients = (value: string | string[] | null | undefined): string => {
        if (Array.isArray(value)) return value.join(", ");
        if (typeof value === "string") return value.split(",").join(", ");
        return "N/A";
    };

    const sanitizedEmail = sanitizeHTML(clickedItem.emailBody);

    return (
        <>
            {clickedItem && (
                <Descriptions bordered className="custom-descriptions" column={1} style={{ marginTop: "20px" }}>
                    <Descriptions.Item label="ID">{clickedItem.id || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Send To">{formatRecipients(clickedItem.sendTo)}</Descriptions.Item>
                    <Descriptions.Item label="Carbon Copy">{formatRecipients(clickedItem.carbonCopy)}</Descriptions.Item>
                    <Descriptions.Item label="Blind Carbon Copy">{formatRecipients(clickedItem.blindCarbonCopy)}</Descriptions.Item>
                    <Descriptions.Item label="Send Date">{clickedItem.sendDate || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Email Body">
                        <div dangerouslySetInnerHTML={{ __html: sanitizedEmail.sanitizedHTML }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Subject">{clickedItem.subject || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Created By">{clickedItem.createdBy || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Status">{clickedItem.status || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Reference Id">{clickedItem.referenceId || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Reference Type">{clickedItem.referenceType || "N/A"}</Descriptions.Item>
                </Descriptions>
            )}
        </>
    );
};

export default SingleEmailView;