import { accentBackgroundColor, primaryColor, secondaryBackgroundColor, secondaryColor } from "@/Utils/Colors";
import { useState } from "react";

export default function DashboardStats({ dataSource }) {
    const [activeDept, setActiveDept] = useState(null);

    // Group employees by department
    const employeesPerDept = dataSource.reduce((acc, curr) => {
        if (!acc[curr.department]) acc[curr.department] = [];
        acc[curr.department].push(curr); // store employee objects per department
        return acc;
    }, {});

    // Convert to array for mapping
    const deptArray = Object.entries(employeesPerDept).map(([name, employees], idx) => ({
        id: idx + 1,
        name,
        totalEmployees: employees.length,
        employees,
    }));

    // Summary
    const totalEmployees = dataSource.length;
    const activeEmployees = dataSource.filter((e) => e.isActive).length;
    const inactiveEmployees = totalEmployees - activeEmployees;

    // const primaryColor = "#0ea5a4";
    // const secondaryColor = "#ef4444";
    // const cardBg = "#f9fafb";
    // const hoverBg = "#d1f5f4";

    return (
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Department Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                {deptArray.map((dept) => (
                    <div
                        key={dept.id}
                        onClick={() => setActiveDept(activeDept === dept.id ? null : dept.id)}
                        style={{
                            padding: "16px",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            cursor: "pointer",
                            backgroundColor: activeDept === dept.id ? secondaryBackgroundColor : accentBackgroundColor,
                            transform: activeDept === dept.id ? "scale(1.02)" : "scale(1)",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ fontWeight: "bold", fontSize: "18px", color: primaryColor }}>{dept.name}</h3>
                            <span style={{ fontSize: "14px", color: "#6b7280" }}>{dept.totalEmployees} Employees</span>
                        </div>

                        {/* Employee List inside the card in 2 columns */}
                        {activeDept === dept.id && (
                            <div style={{ marginTop: "12px", borderTop: "1px solid #e5e7eb", paddingTop: "8px", gap: "8px" }}>
                                {dept.employees.map((emp) => (
                                    <p key={emp.employeeId} style={{ color: "#374151", margin: 0 }}>
                                        {emp.employeeId} - {emp.employeeName}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Summary Card */}
                <div
                    style={{
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        backgroundColor: secondaryBackgroundColor,
                        gridColumn: "1 / -1",
                    }}
                >
                    <h3 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "8px", color: secondaryColor }}>
                        Overall Statistics
                    </h3>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>Total Employees: {totalEmployees}</div>
                        <div>Active: {activeEmployees}</div>
                        <div>Inactive: {inactiveEmployees}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
