import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate } from "react-router-dom";
import ScreenErrorOverlay from "./ScreenErrorOverlay";

export default function ATMErrorBoundary({
  children,
  resetTo = "/take-card",
  OverlayComponent = ScreenErrorOverlay,
}) {
  const { pathname } = useLocation();
  const nav = useNavigate();

  return (
    <ErrorBoundary
      resetKeys={[pathname]}
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <div style={{ position: "relative", height: "100%" }}>
          <OverlayComponent
            message={error?.message || "Something went wrong"}
            okLabel="OK"
            slot={{ side: "right", row: 3 }}
            onOk={() => {
              resetErrorBoundary();
              if (resetTo) {
                nav(resetTo, {
                  replace: true,
                  state: { seconds: 4, doLogout: true },
                });
              }
            }}
          />
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
