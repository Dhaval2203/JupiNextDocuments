import { accentBackgroundColor, accentColor, primaryColor, secondaryBackgroundColor, secondaryColor, whiteColor } from "@/Utils/Colors";
import { Tag } from "antd";
import { useEffect, useRef, useState } from "react";

export default function DashboardStats({ dataSource = [] }) {
    const [activeDept, setActiveDept] = useState(null);
    const [search, setSearch] = useState("");
    const [hoveredDept, setHoveredDept] = useState(null); // for hover effect
    const containerRef = useRef(null);

    /* ---------------- Click outside to collapse ---------------- */
    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setActiveDept(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ---------------- Group employees by department ---------------- */
    const employeesPerDept = dataSource.reduce((acc, curr) => {
        if (!acc[curr.department]) acc[curr.department] = [];
        acc[curr.department].push(curr);
        return acc;
    }, {});

    /* ---------------- Sort + Search departments ---------------- */
    const deptArray = Object.entries(employeesPerDept)
        .sort(([a], [b]) => a.localeCompare(b))
        .filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
        .map(([name, employees], idx) => {
            const activeCount = employees.filter(e => e.isActive).length;
            const inactiveCount = employees.length - activeCount;
            const percentage = Math.round((activeCount / employees.length) * 100);

            return {
                id: idx + 1,
                name,
                employees,
                totalEmployees: employees.length,
                activeCount,
                inactiveCount,
                percentage,
            };
        });

    /* ---------------- Overall stats ---------------- */
    const totalEmployees = dataSource.length;
    const activeEmployees = dataSource.filter(e => e.isActive).length;
    const inactiveEmployees = totalEmployees - activeEmployees;

    return (
        <div ref={containerRef} style={{ padding: 24 }}>
            {/* 🔍 Search */}
            <div style={{ maxWidth: 400, marginBottom: 24 }}>
                <input
                    type="text"
                    placeholder="Search department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        outline: "none",
                    }}
                />
            </div>

            {/* 🧩 Department Cards */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                {deptArray.map(dept => {
                    const isActive = activeDept === dept.id;
                    const isHovered = hoveredDept === dept.id;

                    return (
                        <div
                            key={dept.id}
                            onClick={() => setActiveDept(isActive ? null : dept.id)}
                            onMouseEnter={() => setHoveredDept(dept.id)}
                            onMouseLeave={() => setHoveredDept(null)}
                            style={{
                                position: "relative",
                                borderRadius: 16,
                                padding: 20,
                                cursor: "pointer",
                                backgroundColor: isActive ? accentBackgroundColor : whiteColor,
                                boxShadow: isActive || isHovered
                                    ? "0 10px 25px rgba(0,0,0,0.15)"
                                    : "0 4px 12px rgba(0,0,0,0.08)",
                                transform: isHovered ? "scale(1.03)" : "scale(1)",
                                transition: "all 0.2s",
                                flex: "1 1 calc(33% - 24px)",
                                minWidth: 250,
                            }}
                        >
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                                <span
                                    style={{
                                        display: "inline-block",
                                        fontSize: 16,
                                        fontWeight: 600,
                                        color: primaryColor,
                                        borderBottom: `2px solid ${secondaryColor}`
                                    }}
                                >
                                    {dept.name}
                                </span>

                                <span
                                    style={{
                                        fontSize: 12,
                                        backgroundColor: secondaryColor,
                                        color: whiteColor,
                                        padding: "2px 8px",
                                        borderRadius: 12,
                                    }}
                                >
                                    {dept.totalEmployees} Employees
                                </span>
                            </div>

                            {/* Progress Info */}
                            <div style={{ marginTop: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
                                    <span style={{ color: primaryColor, fontWeight: 600 }}>
                                        Active: {dept.activeCount}
                                    </span>
                                    <span style={{ color: secondaryColor, fontWeight: 600 }}>
                                        Inactive: {dept.inactiveCount}
                                    </span>
                                    <span style={{ fontWeight: 600, color: accentColor }}>
                                        Active Percentage: {dept.percentage}%
                                    </span>
                                </div>
                                <div style={{ height: 8, backgroundColor: secondaryBackgroundColor, borderRadius: 4, overflow: "hidden" }}>
                                    <div
                                        style={{
                                            width: `${dept.percentage}%`,
                                            height: "100%",
                                            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                                            transition: "width 0.3s",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* 👥 Employee List as Tags */}
                            {isActive && (
                                <div style={{ marginTop: 16, borderTop: "1px dashed #ccc", paddingTop: 8, maxHeight: 120, overflowY: "auto" }}>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                        {dept.employees.map(emp => (
                                            <Tag
                                                key={emp.employeeId}
                                                color={emp.isActive ? primaryColor : secondaryColor}
                                                style={{ fontWeight: 500 }}
                                            >
                                                {emp.employeeId} — {emp.employeeName}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 📌 Summary */}
            <div
                style={{
                    marginTop: 32,
                    borderRadius: 16,
                    padding: 24,
                    backgroundColor: whiteColor,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 24,
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h3 style={{ fontSize: 20, fontWeight: 700, color: accentColor }}>Overall Statistics</h3>

                <div style={{ display: "flex", gap: 24 }}>
                    <Stat label="Total" value={totalEmployees} color={accentColor} />
                    <Stat label="Active" value={activeEmployees} color={primaryColor} />
                    <Stat label="Inactive" value={inactiveEmployees} color={secondaryColor} />
                </div>
            </div>
        </div>
    );
}

/* ---------------- Small Stat Card ---------------- */
function Stat({ label, value, color }) {
    return (
        <div style={{ textAlign: "center", minWidth: 70 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: color }}>{value}</div>
            <div style={{ fontSize: 16, color: color }}>{label}</div>
        </div>
    );
}
