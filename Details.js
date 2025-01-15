import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRocket } from "react-icons/fa";

// Loading Animation Component
const LoadingAnimation = () => {
  const [loadingText, setLoadingText] = useState("Loading");

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) =>
        prev === "Loading..." ? "Loading" : prev + "."
      );
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.loadingContainer}>
      <style>
        {`
          @keyframes scaleUpDown {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }

          @keyframes combinedAnimation {
            0%, 40% { transform: scale(1); }
            20% { transform: scale(1.2); }
            50% { transform: scale(1) rotate(0deg); }
            100% { transform: scale(1) rotate(-360deg); }
          }
        `}
      </style>
      <FaRocket style={styles.rocketIcon} />
      <p style={styles.loadingText}>{loadingText}</p>
    </div>
  );
};

// Styles for the loading animation and page layout
const styles = {
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#F3F4F6",
  },
  rocketIcon: {
    fontSize: "50px",
    color: "#2563EB",
    animation: "combinedAnimation 1.12s infinite ease-in-out",
  },
  loadingText: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#374151",
    fontFamily: "Arial, sans-serif",
  },
};

const Details = () => {
  const [customers, setCustomers] = useState([]);
  const [customerBots, setCustomerBots] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/customers")
      .then((response) => {
        const fetchedCustomers = response.data.customers;
        setCustomers(fetchedCustomers);

        const botRequests = fetchedCustomers.map((customer) =>
          axios.get("http://127.0.0.1:5000/api/bots", {
            params: { customer_name: customer },
          })
        );

        Promise.all(botRequests).then((botResponses) => {
          const botsData = {};
          botResponses.forEach((botResponse, index) => {
            botsData[fetchedCustomers[index]] = botResponse.data.bots;
          });
          setCustomerBots(botsData);
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error("Error fetching data", error);
        setLoading(false);
      });
  }, []);

  const renderBots = (bots) => {
    if (!bots || bots.length === 0) return "No Bots";

    let botLines = [];
    let currentLine = "";

    bots.forEach((bot, index) => {
      if (currentLine.length + bot.length > 95) {
        botLines.push(currentLine.trim());
        currentLine = bot + ", ";
      } else {
        currentLine += bot + ", ";
      }

      // Handle the last bot
      if (index === bots.length - 1) {
        botLines.push(currentLine.trim());
      }
    });

    return botLines.map((line, idx) => (
      <div key={idx}>
        {line}
      </div>
    ));
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div
      style={{
        backgroundColor: "#F3F4F6",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", height: "100%" }}>
        <div
          style={{
            width: "16rem",
            backgroundColor: "white",
            boxShadow: "4px 0 6px -1px rgba(0, 0, 0, 0.1)",
            position: "fixed",
            height: "100%",
          }}
        >
          <div style={{ padding: "1.5rem", display: "flex", alignItems: "center" }}>
            <FaRocket size={24} color="#2563EB" style={{ marginRight: "0.5rem" }} />
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1F2937" }}>
              Apollo Studios
            </h1>
          </div>
          <nav style={{ marginTop: "1.5rem" }}>
            <a
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.75rem 1.5rem",
                color: "#6B7280",
                textDecoration: "none",
                borderRadius: "0.375rem",
                transition: "background-color 0.15s ease-in-out",
              }}
            >
              Overview
            </a>
            <a
              href="/details"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.75rem 1.5rem",
                color: "#2563EB",
                backgroundColor: "#EFF6FF",
                borderRight: `4px solid #2563EB`,
                textDecoration: "none",
                transition: "background-color 0.15s ease-in-out",
              }}
            >
              Details
            </a>
          </nav>
        </div>

        <div style={{ flex: 1, overflow: "auto", marginLeft: "16rem" }}>
          <header
            style={{
              backgroundColor: "white",
              boxShadow:
                "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              position: "sticky",
              top: 0,
              zIndex: 10,
              padding: "1rem",
            }}
          >
            {/* Optional Header Content */}
          </header>

          <main style={{ maxWidth: "80rem", margin: "0 auto", padding: "1.5rem" }}>
            <div
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                marginBottom: "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "4px",
                }}
              >
                Customer - Bot Data
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "4px" }}>
                All bots grouped by customer
              </p>
              <table
                style={{
                  minWidth: "100%",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "0.75rem 1.5rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Customer
                    </th>
                    <th
                      style={{
                        padding: "0.75rem 1.5rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Bots
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          padding: "1rem 1.5rem",
                          whiteSpace: "nowrap",
                          fontSize: "0.875rem",
                          color: "#111827",
                          fontStyle: "italic",
                        }}
                      >
                        {customer}
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.5rem",
                          whiteSpace: "nowrap",
                          fontSize: "0.875rem",
                          color: "#111827",
                          fontStyle: "italic",
                        }}
                      >
                        {renderBots(customerBots[customer])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "4px",
                }}
              >
                Bot Data
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "4px" }}>
                All bots with description
              </p>
              <table
                style={{
                  minWidth: "100%",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "0.75rem 1.5rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Bot Name
                    </th>
                    <th
                      style={{
                        padding: "0.75rem 1.5rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Information
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(customerBots).map((customer, index) =>
                    customerBots[customer].map((bot, botIndex) => (
                      <tr key={`${index}-${botIndex}`}>
                        <td
                          style={{
                            padding: "1rem 1.5rem",
                            whiteSpace: "nowrap",
                            fontSize: "0.875rem",
                            color: "#111827",
                            fontStyle: "italic",
                          }}
                        >
                          {bot}
                        </td>
                        <td
                          style={{
                            padding: "1rem 1.5rem",
                            whiteSpace: "nowrap",
                            fontSize: "0.875rem",
                            color: "#111827",
                            fontStyle: "italic",
                          }}
                        >
                          {/* Additional Bot Information Here */}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Details;
