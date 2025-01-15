import React, { useState, useEffect } from "react";
import axios from "axios";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  PieChart as PieChartIcon,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { FaRocket } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Customizable styles
const datePickerStyle = (borderColor) => ({
  height: "24px",
  width: "240px",
  padding: "0.5rem 1rem",
  fontSize: "16px",
  borderRadius: "1rem",
  color: "#4B5563",
  marginRight: "1rem",
  border: `2px solid ${borderColor}`,
});

const submitButtonStyle = {
  height: "44px",
  width: "240px",
  padding: "0.5rem 1rem",
  fontSize: "16px",
  color: "white",
  backgroundColor: "#2563EB",
  borderRadius: "1rem",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.15s ease-in-out",
};

const BLUE = "#2563EB";
const RED = "#ED474A";
const pieChartColors = ["#60A5FA", "#F87171"];
const barChartColors = { success: "#60A5FA", error: "#F87171" };

const DashboardCard = ({ title, value, percentage, subValue, trend, icon: Icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "0.75rem",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          position: "absolute",
          top: "0.75rem",
          right: "0.75rem",
          transition: "transform 0.3s ease-in-out",
          transform: isHovered ? "rotate(15deg)" : "rotate(0deg)",
        }}
      >
        <Icon size={24} color={BLUE} />
      </div>
      <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#374151" }}>
        {title}
      </h3>
      <div
        style={{ marginTop: "1rem", display: "flex", alignItems: "baseline" }}
      >
        <CountUp
          end={value}
          duration={2.5}
          separator=","
          style={{ fontSize: "1.875rem", fontWeight: 800, color: "#111827" }}
        />
        <span
          style={{
            marginLeft: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#6B7280",
          }}
        >
          {percentage}
        </span>
      </div>
      <p
        style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "#6B7280" }}
      >
        {subValue}
      </p>
    </div>
  );
};

const DataTable = ({ botsData }) => (
  <div
    style={{
      backgroundColor: "white",
      padding: "1.5rem",
      borderRadius: "0.75rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      overflowX: "auto",
    }}
  >
    <table
      style={{ minWidth: "100%", borderCollapse: "separate", borderSpacing: 0 }}
    >
      <thead>
        <tr>
          {[
            "Bot Name",
            "DTD Transactions",
            "DTD Transactions Processed",
            "DTD Business Exceptions", // New column header
            "DTD Transactions Failed",
            "DTD Success (%)",
            "DTD Error (%)",
          ].map((header, index) => (
            <th
              key={index}
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
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {botsData.map((bot, index) => (
          <tr
            key={index}
            style={{ transition: "background-color 0.15s ease-in-out" }}
          >
            <td
              style={{
                padding: "1rem 1.5rem",
                whiteSpace: "nowrap",
                fontSize: "0.875rem",
                color: "#111827",
                fontStyle: "italic",
              }}
            >
              {bot.name}
            </td>
            <td
              style={{
                padding: "1rem 1.5rem",
                whiteSpace: "nowrap",
                fontSize: "0.875rem",
                color: "#6B7280",
              }}
            >
              {bot.success + bot.error + bot.businessExceptions}
            </td>
            <td
              style={{
                padding: "1rem 1.5rem",
                whiteSpace: "nowrap",
                fontSize: "0.875rem",
                color: "#6B7280",
              }}
            >
              {bot.success}
            </td>
            <td
              style={{
                padding: "1rem 1.5rem",
                whiteSpace: "nowrap",
                fontSize: "0.875rem",
                color: "#6B7280",
              }}
            >
              {bot.businessExceptions}
            </td>
            <td
              style={{
                padding: "1rem 1.5rem",
                whiteSpace: "nowrap",
                fontSize: "0.875rem",
                color: "#6B7280",
              }}
            >
              {bot.error}
            </td>
            <td
              style={{
                padding: "1rem 1.5rem",
                whiteSpace: "nowrap",
                fontSize: "0.875rem",
                color: "#6B7280",
              }}
            >
              {(
                ((bot.success + bot.businessExceptions) /
                  (bot.success + bot.error + bot.businessExceptions)) *
                100
              ).toFixed(2)}
              %
            </td>
            <td
              style={{
                padding: "1rem 1.5rem",
                whiteSpace: "nowrap",
                fontSize: "0.875rem",
                color: "#6B7280",
              }}
            >
              {(
                (bot.error /
                  (bot.success + bot.error + bot.businessExceptions)) *
                100
              ).toFixed(2)}
              %
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Dashboard = () => {
  const [customerName, setCustomerName] = useState("");
  const [dateRange, setDateRange] = useState({
    start: new Date("2024-08-01"),
    end: new Date("2024-08-15"),
  });
  const [botsData, setBotsData] = useState([]);
  const [totalSuccessPercentage, setTotalSuccessPercentage] = useState(0);
  const [totalErrorPercentage, setTotalErrorPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchReportData = (customer, start, end) => {
    setLoading(true);
    const formattedStartDate = start.toISOString().split("T")[0];
    const formattedEndDate = end.toISOString().split("T")[0];

    axios
      .get("http://127.0.0.1:5000/api/report", {
        params: {
          company_name: customer,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        },
      })
      .then((response) => {
        const data = response.data;
        const bots = Object.keys(data["DTD Transactions"] || {}).map((key) => {
          const botName = key.split(",")[1].replace(")", "").replace("'", "").trim();
          const success = data["DTD Transactions Processed"][key];
          const error = data["DTD Transactions Failed"][key];
          const businessExceptions = data["DTD Business Exceptions"] ? data["DTD Business Exceptions"][key] : 0;

          const total = success + error + businessExceptions;
          const successPercentage = total ? ((success + businessExceptions) / total) * 100 : NaN;
          const errorPercentage = total ? (error / total) * 100 : NaN;
          return {
            name: botName,
            success,
            error,
            businessExceptions,
            total,
            successPercentage,
            errorPercentage,
          };
        });

        setBotsData(bots);

        // Calculate the total sums of success and error percentages
        let totalSuccessPercentSum = 0;
        let totalErrorPercentSum = 0;
        let validSuccessCount = 0;

        bots.forEach(bot => {
          if (!isNaN(bot.successPercentage)) {
            totalSuccessPercentSum += bot.successPercentage;
            validSuccessCount += 1;
          }
          if (!isNaN(bot.errorPercentage)) {
            totalErrorPercentSum += bot.errorPercentage;
          }
        });

        const avgSuccessPercentage = validSuccessCount
          ? totalSuccessPercentSum / validSuccessCount
          : 0;

        const avgErrorPercentage = totalErrorPercentSum
          ? totalErrorPercentSum / bots.length
          : 0;

        setTotalSuccessPercentage(avgSuccessPercentage.toFixed(2));
        setTotalErrorPercentage(avgErrorPercentage.toFixed(2));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching the report data:", error);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    fetchReportData(customerName, dateRange.start, dateRange.end);
  };

  // Data for the pie chart
  const pieChartData = [
    { name: "Success", value: botsData.reduce((sum, bot) => sum + bot.success, 0) },
    { name: "Error", value: botsData.reduce((sum, bot) => sum + bot.error, 0) },
  ];

  const borderColor = "#D9D9D9";

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
          }}
        >
          <div style={{ padding: "1.5rem", display: 'flex', alignItems: 'center' }}>
            <FaRocket size={24} color={BLUE} style={{ marginRight: "0.5rem" }} />
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
                color: BLUE,
                backgroundColor: "#EFF6FF",
                borderRight: `4px solid ${BLUE}`,
                textDecoration: "none",
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
                color: "#6B7280",
                textDecoration: "none",
                borderRadius: "0.375rem",
                transition: "background-color 0.15s ease-in-out",
              }}
            >
              Details
            </a>
          </nav>
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          <header
            style={{
              backgroundColor: "white",
              boxShadow:
                "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <div style={{ padding: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={datePickerStyle(borderColor)}
                />
                <DatePicker
                  selected={dateRange.start}
                  onChange={(date) =>
                    setDateRange({ ...dateRange, start: date })
                  }
                  selectsStart
                  startDate={dateRange.start}
                  endDate={dateRange.end}
                  placeholderText="Start Date"
                  customInput={
                    <input
                      style={datePickerStyle(borderColor)}
                    />
                  }
                />
                <DatePicker
                  selected={dateRange.end}
                  onChange={(date) => setDateRange({ ...dateRange, end: date })}
                  selectsEnd
                  startDate={dateRange.start}
                  endDate={dateRange.end}
                  minDate={dateRange.start}
                  placeholderText="End Date"
                  customInput={
                    <input
                      style={datePickerStyle(borderColor)}
                    />
                  }
                />
                <button onClick={handleSearch} style={submitButtonStyle}>
                  Search
                </button>
              </div>
            </div>
          </header>

          <main
            style={{ maxWidth: "80rem", margin: "0 auto", padding: "1.5rem" }}
          >
            {loading ? (
              <p style={{ textAlign: "center", padding: "2rem" }}>Loading...</p>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1.5rem",
                    marginBottom: "2rem",
                  }}
                >
                  <DashboardCard
                    title="Total Transactions"
                    value={botsData.reduce(
                      (total, bot) => total + bot.success + bot.error + bot.businessExceptions,
                      0
                    )}
                    percentage=""
                    subValue={`${botsData.length} Bots`}
                    trend="up"
                    icon={PieChartIcon}
                  />
                  <DashboardCard
                    title="Average Success Percentage"
                    value={parseFloat(totalSuccessPercentage)}
                    percentage="%"
                    subValue="Overall Success DTD"
                    trend="up"
                    icon={TrendingUp}
                  />
                  <DashboardCard
                    title="Average Errors Percentage"
                    value={parseFloat(totalErrorPercentage)}
                    percentage="%"
                    subValue="Overall Errors DTD"
                    trend="down"
                    icon={AlertTriangle}
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1.5rem",
                    marginBottom: "2rem",
                  }}
                >
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
                        marginBottom: "1rem",
                      }}
                    >
                      Bots Data
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={botsData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="success" fill={barChartColors.success} />
                        <Bar dataKey="error" fill={barChartColors.error} />
                        <Bar dataKey="businessExceptions" fill="#FFA500" /> {/* Color for Business Exceptions */}
                      </BarChart>
                    </ResponsiveContainer>
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
                        marginBottom: "1rem",
                      }}
                    >
                      Errors vs Success
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={pieChartColors[index % pieChartColors.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <DataTable botsData={botsData} />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
