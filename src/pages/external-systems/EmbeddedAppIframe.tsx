import {FC, useEffect, useRef, useState} from "react";

interface EmbeddedAppIframeProps {
    id: string;
    title: string;
    type: "epc" | "cpq";
    path?: string;
    sandbox?: string;
}

const BASE_URLS: Record<"cpq" | "epc", string> = {
    cpq: "https://ae168c1fef3bd4fa5bf4e210f1993a62-b2fda079beb6b96e.elb.ap-southeast-2.amazonaws.com/cpq-frontend-service/cpq",
    epc: "http://k8s-linknetdemo-8da485f2ee-1301521822.ap-southeast-1.elb.amazonaws.com/epc-frontend-service",
};

const EmbeddedAppIframe: FC<EmbeddedAppIframeProps> = ({
                                                           id,
                                                           title,
                                                           type,
                                                           path = ""
                                                       }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeHeight, setIframeHeight] = useState(window.innerHeight - 150);

    const formattedPath = path.startsWith("/") ? path.slice(1) : path;
    const baseUrl = BASE_URLS[type];
    const iframeSrc = type === "cpq" ? baseUrl : `${baseUrl}/${formattedPath}`;

    useEffect(() => {
        const updateIframeHeight = () => {
            const navbarHeight = 70;
            const breadcrumbHeight = 50;
            const newHeight = window.innerHeight - (navbarHeight + breadcrumbHeight);
            setIframeHeight(newHeight);
        };

        window.addEventListener("resize", updateIframeHeight);
        updateIframeHeight();

        return () => window.removeEventListener("resize", updateIframeHeight);
    }, []);

    useEffect(() => {
        const sendUserDataToIframe = () => {
            const userData = localStorage.getItem("user-data");
            if (userData && iframeRef.current) {
                iframeRef.current.onload = () => {
                    iframeRef.current?.contentWindow?.postMessage(
                        {type: "user-data", payload: userData},
                        new URL(baseUrl).origin
                    );
                };
            }
        };

        sendUserDataToIframe();
    }, [baseUrl]);

    return (
        <div style={{display: "flex", flexDirection: "column", height: "100vh"}}>
            <iframe
                id={id}
                title={title}
                ref={iframeRef}
                width="100%"
                height={iframeHeight}
                src={iframeSrc}
                // sandbox={sandbox}
                style={{
                    flexGrow: 1,
                    transition: "height 0.3s ease-in-out",
                    border: "none",
                }}
            />
        </div>
    );
};

export default EmbeddedAppIframe;