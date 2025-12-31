import {
    EditOutlined,
    FileExcelOutlined,
    PlusOutlined
} from '@ant-design/icons';
import {
    Button,
    Col,
    Input,
    Row,
    Select,
    Table,
    Tag,
    Typography,
} from 'antd';
import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

import { CEO_EmployeeId, CTO_EmployeeId } from '@/Utils/Const';
import { primaryColor, secondaryColor, whiteColor } from '../../Utils/Colors';
import JupiNextLoader from '../JupiNextLoader';

const { Search } = Input;
const { Text } = Typography;

export default function EmployeeTable({
    employees,
    loading,
    onAdd,
    onEdit,
}) {
    const [searchText, setSearchText] = useState('');
    const [designationFilter, setDesignationFilter] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null);

    /* ---------------- Data Source ---------------- */
    const dataSource = useMemo(
        () =>
            employees.map((e) => ({
                ...e,
                key: e.id,
                status: e.isActive ? 'Active' : 'Inactive',
            })),
        [employees]
    );

    const NON_EDITABLE_EMPLOYEE_IDS = [
        CEO_EmployeeId,
        CTO_EmployeeId,
    ];

    /* ---------------- Filters ---------------- */
    const filteredData = useMemo(() => {
        return dataSource.filter((emp) => {
            const matchesSearch =
                emp.employeeName
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                emp.employeeId
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase());

            const matchesDesignation =
                designationFilter.length === 0 ||
                designationFilter.includes(emp.designation);

            const matchesStatus =
                !statusFilter || emp.status === statusFilter;

            return matchesSearch && matchesDesignation && matchesStatus;
        });
    }, [dataSource, searchText, designationFilter, statusFilter]);

    /* ---------------- Export Excel ---------------- */
    const handleExportExcel = () => {
        const exportData = filteredData.map((emp) => ({
            'Employee ID': emp.employeeId,
            'Employee Name': emp.employeeName,
            'Designation': emp.designation,
            'Department': emp.department,
            'Status': emp.status,
            'Primary Email': emp.primaryEmail,
            'Secondary Email': emp.secondaryEmail,
            'Bank Name': emp.bankName,
            'Bank Account': emp.bankAccount,
        }));

        const worksheet = XLSX.utils.json_to_sheet([]);
        const TOTAL_COLS = 8; // A → H

        /* ================= HEADER ================= */

        // Only JupiNext title
        XLSX.utils.sheet_add_aoa(
            worksheet,
            [['JupiNext']],
            { origin: 'A1' }
        );

        // Empty row after header
        XLSX.utils.sheet_add_aoa(
            worksheet,
            [[]],
            { origin: 'A2' }
        );

        worksheet['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: TOTAL_COLS - 1 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: TOTAL_COLS - 1 } },
        ];

        worksheet['A1'].s = {
            font: { bold: true, sz: 18 },
            alignment: { horizontal: 'center' },
        };

        /* ================= TABLE ================= */

        XLSX.utils.sheet_add_json(worksheet, exportData, {
            origin: 'A3',
        });

        const tableEndRow = exportData.length + 3;

        /* ================= FOOTER ================= */

        const formattedDate = new Date().toLocaleDateString('en-GB');

        // empty row
        XLSX.utils.sheet_add_aoa(
            worksheet,
            [[]],
            { origin: `A${tableEndRow + 1}` }
        );

        // Generated on
        XLSX.utils.sheet_add_aoa(
            worksheet,
            [[`Generated on ${formattedDate}`]],
            { origin: `A${tableEndRow + 2}` }
        );

        // empty row
        XLSX.utils.sheet_add_aoa(
            worksheet,
            [[]],
            { origin: `A${tableEndRow + 3}` }
        );

        // Footer brand line (same row)
        XLSX.utils.sheet_add_aoa(
            worksheet,
            [['JupiNext - Where the Next Begins']],
            { origin: `A${tableEndRow + 4}` }
        );

        worksheet['!merges'].push(
            { s: { r: tableEndRow + 1, c: 0 }, e: { r: tableEndRow + 1, c: TOTAL_COLS - 1 } },
            { s: { r: tableEndRow + 2, c: 0 }, e: { r: tableEndRow + 2, c: TOTAL_COLS - 1 } },
            { s: { r: tableEndRow + 3, c: 0 }, e: { r: tableEndRow + 3, c: TOTAL_COLS - 1 } },
            { s: { r: tableEndRow + 4, c: 0 }, e: { r: tableEndRow + 4, c: TOTAL_COLS - 1 } }
        );

        worksheet[`A${tableEndRow + 2}`].s = {
            alignment: { horizontal: 'center' },
        };

        worksheet[`A${tableEndRow + 4}`].s = {
            font: { bold: true, italic: true },
            alignment: { horizontal: 'center' },
        };

        /* ================= COLUMN WIDTH ================= */

        worksheet['!cols'] = [
            { wch: 16 },
            { wch: 22 },
            { wch: 18 },
            { wch: 18 },
            { wch: 14 },
            { wch: 28 },
            { wch: 28 },
            { wch: 20 },
        ];

        /* ================= WORKBOOK ================= */

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

        XLSX.writeFile(workbook, 'Employee_List.xlsx');
    };

    /* ---------------- Columns ---------------- */
    const columns = [
        { title: 'Employee ID', dataIndex: 'employeeId' },
        {
            title: 'Name',
            dataIndex: 'employeeName',
            render: (t) => <Text strong>{t}</Text>,
        },
        { title: 'Designation', dataIndex: 'designation' },
        { title: 'Department', dataIndex: 'department' },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (s) => (
                <Tag color={s === 'Active' ? 'green' : 'red'}>{s}</Tag>
            ),
        },
        {
            title: 'Actions',
            align: 'center',
            render: (_, record) => {
                const isEditable = !NON_EDITABLE_EMPLOYEE_IDS.includes(
                    record.employeeId
                );

                return isEditable ? (
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        style={{ color: primaryColor }}
                        onClick={() => onEdit(record)}
                    />
                ) : null;
            },
        },
    ];

    const designations = useMemo(
        () => [
            ...new Set(
                employees.map((e) => e.designation).filter(Boolean)
            ),
        ],
        [employees]
    );

    return (
        <>
            {/* ---------------- Filters ---------------- */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} md={6}>
                    <Search
                        placeholder="Employee ID or Name"
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                    />
                </Col>

                <Col xs={24} md={6}>
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Designation"
                        style={{ width: '100%' }}
                        onChange={setDesignationFilter}
                    >
                        {designations.map((d) => (
                            <Select.Option key={d} value={d}>
                                {d}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24} md={6}>
                    <Select
                        allowClear
                        placeholder="Status"
                        style={{ width: '100%' }}
                        onChange={setStatusFilter}
                    >
                        <Select.Option value="Active">
                            Active
                        </Select.Option>
                        <Select.Option value="Inactive">
                            Inactive
                        </Select.Option>
                    </Select>
                </Col>

                <Col
                    xs={24}
                    md={6}
                    style={{
                        textAlign: 'right',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 8,
                        flexWrap: 'wrap',
                    }}
                >
                    <Button
                        style={{ color: whiteColor, backgroundColor: secondaryColor }}
                        icon={<FileExcelOutlined />}
                        onClick={handleExportExcel}
                    >
                        Export Excel
                    </Button>

                    <Button
                        icon={<PlusOutlined />}
                        style={{
                            background: primaryColor,
                            color: whiteColor,
                        }}
                        onClick={onAdd}
                    >
                        Add Employee
                    </Button>
                </Col>
            </Row>

            {/* ---------------- Table ---------------- */}
            <Table
                loading={{
                    spinning: loading,
                    indicator: <JupiNextLoader done={!loading} />,
                }}
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 10 }}
                bordered
            />
        </>
    );
}
