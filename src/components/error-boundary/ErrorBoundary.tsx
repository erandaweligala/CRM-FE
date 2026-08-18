import { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from "react-error-boundary";
import { Button, theme } from "antd";
import "./ErrorBoundary.scss";
import WarningIcon from "../../assets/images/warning-icon.png";

interface Props {
  children: ReactNode;
}

const ErrorFallback = ({ error }: FallbackProps) => {
   const { token } = theme.useToken();
  console.error("ErrorBoundary caught an error", error);

  return (
    <div className="error-boundary default-height">
      <div className="error-boundary-content">
        <img
          src={WarningIcon}
          alt="Warning"
          className="error-boundary-icon"
        />
        <h3>Something went wrong</h3>
        <p style={{ color: token.colorTextSecondary }}>
          There was a problem processing the request. Please try again.
        </p>
        <Button
          type="primary"
          onClick={() => window.location.reload()}
        >
          Return to last page
        </Button>
      </div>
    </div>
  );
};

const ErrorBoundary = ({ children }: Props) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;