import {
    Table,
    Input,
    Select,
    Row,
    Col,
    Tag,
    Button,
    Typography,
} from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';

import { primaryColor } from '../../Utils/Colors';

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

    const dataSource = useMemo(
        () =>
            employees.map((e) => ({
                ...e,
                key: e.id,
                status: e.isActive ? 'Active' : 'Inactive',
            })),
        [employees]
    );

    const filteredData = useMemo(() => {
        return dataSource.filter((emp) => {
            const matchesSearch =
                emp.employeeName?.toLowerCase().includes(searchText.toLowerCase()) ||
                emp.employeeId?.toLowerCase().includes(searchText.toLowerCase());

            const matchesDesignation =
                designationFilter.length === 0 ||
                designationFilter.includes(emp.designation);

            const matchesStatus =
                !statusFilter || emp.status === statusFilter;

            return matchesSearch && matchesDesignation && matchesStatus;
        });
    }, [dataSource, searchText, designationFilter, statusFilter]);

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
            render: (s) => <Tag color={s === 'Active' ? 'green' : 'red'}>{s}</Tag>,
        },
        {
            title: 'Actions',
            align: 'center',
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    style={{ color: primaryColor }}
                    onClick={() => onEdit(record)}
                />
            ),
        },
    ];

    const designations = useMemo(
        () => [...new Set(employees.map((e) => e.designation).filter(Boolean))],
        [employees]
    );

    return (
        <>
            {/* FILTERS */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} md={6}>
                    <Search placeholder="Employee ID or Name" onChange={(e) => setSearchText(e.target.value)} />
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
                            <Select.Option key={d} value={d}>{d}</Select.Option>
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
                        <Select.Option value="Active">Active</Select.Option>
                        <Select.Option value="Inactive">Inactive</Select.Option>
                    </Select>
                </Col>

                <Col xs={24} md={6} style={{ textAlign: 'right' }}>
                    <Button
                        icon={<PlusOutlined />}
                        style={{ background: primaryColor, color: '#fff' }}
                        onClick={onAdd}
                    >
                        Add Employee
                    </Button>
                </Col>
            </Row>

            <Table
                loading={loading}
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 10 }}
                bordered
            />
        </>
    );
}
