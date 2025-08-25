export default function ATMChassis({ children }) {
  return (
    <div
      style={{
        backgroundColor: "#9475A2",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        height: "100vh",

        paddingTop: "35px",
      }}
    >
      {children}
    </div>
  );
}
