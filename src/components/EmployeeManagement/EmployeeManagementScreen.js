'use client';

import {
    Card,
    Table,
    Input,
    Select,
    Row,
    Col,
    Tag,
    Typography,
    Button,
    Modal,
    Form,
    Switch,
} from 'antd';
import { EditOutlined, FileExcelOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import {
    primaryColor,
    secondaryColor,
    whiteColor,
} from '../../Utils/Colors';
import { EMPLOYEE_DATA } from '../../Utils/Const';
import { CustomCloseIcon, PreviewModalHeader, previewModalProps } from '@/Utils/UIStyles/uiStyles';
import DashboardStats from "./DashboardStats";

const { Title, Text } = Typography;
const { Search } = Input;

const maskAccountNumber = (account) => `XXXX XXXX ${account.slice(-5)}`;

export default function EmployeeManagement() {
    const [searchText, setSearchText] = useState('');
    const [designationFilter, setDesignationFilter] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    const [form] = Form.useForm();

    // Data source with status from isActive
    const dataSource = EMPLOYEE_DATA.map((emp) => ({
        ...emp,
        key: emp.employeeId,
        status: emp.isActive ? 'Active' : 'Inactive',
    }));

    const filteredData = useMemo(() => {
        return dataSource.filter(emp => {
            const matchesSearch =
                emp.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
                emp.employeeId.toLowerCase().includes(searchText.toLowerCase());

            const matchesDesignation =
                designationFilter.length === 0 || designationFilter.includes(emp.designation);

            const matchesStatus =
                !statusFilter || emp.status === statusFilter;

            return matchesSearch && matchesDesignation && matchesStatus;
        });
    }, [dataSource, designationFilter, searchText, statusFilter]);

    const handleEdit = (record) => {
        setIsAddMode(false);
        setSelectedEmployee(record);
        form.setFieldsValue({
            ...record,
            isActive: record.status === 'Active',
        });
        setEditModalOpen(true);
    };

    const handleAddNew = () => {
        setIsAddMode(true);
        setSelectedEmployee(null);
        form.resetFields();
        setEditModalOpen(true);
    };

    const handleViewProfile = (record) => {
        setSelectedEmployee(record);
        setProfileModalOpen(true);
    };

    const handleExportExcel = () => {
        console.log('Export Excel clicked');
    };

    const columns = [
        {
            title: 'Employee ID',
            dataIndex: 'employeeId',
            width: 120,
            sorter: (a, b) => a.employeeId.localeCompare(b.employeeId),
        },
        {
            title: 'Name',
            dataIndex: 'employeeName',
            render: text => <Text strong>{text}</Text>,
            sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            sorter: (a, b) => a.designation.localeCompare(b.designation),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            sorter: (a, b) => a.department.localeCompare(b.department),
        },
        {
            title: 'Bank Details',
            render: (_, record) => (
                <Text>{record.bankName} ({maskAccountNumber(record.bankAccount)})</Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: status => (
                <Tag color={status === 'Active' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: 'Actions',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        title="View Profile"
                        onClick={() => handleViewProfile(record)}
                        style={{ color: secondaryColor, fontSize: 16 }}
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        title="Edit Employee"
                        onClick={() => handleEdit(record)}
                        style={{ color: primaryColor, fontSize: 16 }}
                    />
                </div>
            ),
        },
    ];

    const designations = [...new Set(EMPLOYEE_DATA.map(e => e.designation))];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div style={{ paddingTop: 80, paddingInline: 16 }}>
                {/* Quick Stats */}
                <DashboardStats dataSource={dataSource} />

                <Card style={{ maxWidth: 1400, margin: '0 auto', borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                    {/* Header */}
                    <Card style={{ background: primaryColor, borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                        <Title level={3} style={{ color: whiteColor, marginBottom: 0 }}>
                            Employee Management
                        </Title>
                        <Text style={{ color: '#E5E7EB' }}>
                            Search, filter, edit, add, and manage employees
                        </Text>
                    </Card>

                    {/* Filters + Add + Export */}
                    <Card style={{ borderRadius: 12, marginBottom: 24 }}>
                        <Row gutter={[16, 16]} align="bottom">
                            <Col xs={24} md={6}>
                                <Text strong>Search Employee</Text>
                                <Search
                                    placeholder="Enter Employee ID or Name"
                                    allowClear
                                    onChange={e => setSearchText(e.target.value)}
                                />
                            </Col>

                            <Col xs={24} md={6}>
                                <Text strong>Designation</Text>
                                <Select
                                    mode="multiple"
                                    placeholder="Select Designation(s)"
                                    allowClear
                                    style={{ width: '100%' }}
                                    onChange={setDesignationFilter}
                                    value={designationFilter}
                                >
                                    {designations.map(des => (
                                        <Select.Option key={des} value={des}>
                                            {des}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>

                            <Col xs={24} md={6}>
                                <Text strong>Status</Text>
                                <Select
                                    allowClear
                                    placeholder="Select Status"
                                    style={{ width: '100%' }}
                                    onChange={setStatusFilter}
                                    value={statusFilter}
                                >
                                    <Select.Option value="Active">Active</Select.Option>
                                    <Select.Option value="Inactive">Inactive</Select.Option>
                                </Select>
                            </Col>

                            {/* Add New Employee + Excel Export */}
                            <Col xs={24} md={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={handleAddNew}
                                    title="Add New Employee"
                                    style={{
                                        backgroundColor: whiteColor,
                                        color: secondaryColor,
                                        borderColor: secondaryColor,
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 20,
                                    }}
                                />
                                <Button
                                    icon={<FileExcelOutlined />}
                                    onClick={handleExportExcel}
                                    title="Export to Excel"
                                    style={{
                                        backgroundColor: whiteColor,
                                        color: primaryColor,
                                        borderColor: primaryColor,
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 20,
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card>

                    {/* Table */}
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        pagination={{ pageSize: 10 }}
                        bordered
                        rowClassName={() => 'hover-row'}
                        style={{ cursor: 'pointer' }}
                    />
                </Card>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                open={editModalOpen}
                width={800}
                closeIcon={<CustomCloseIcon primaryColor={primaryColor} secondaryColor={secondaryColor} />}
                onCancel={() => setEditModalOpen(false)}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => setEditModalOpen(false)}
                        style={{
                            background: whiteColor,
                            color: primaryColor,
                            border: `1px solid ${primaryColor}`,
                            borderRadius: 10,
                            fontWeight: 600,
                            padding: '0 20px',
                            height: 40,
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="save"
                        onClick={() => form.submit()}
                        style={{
                            background: primaryColor,
                            color: whiteColor,
                            borderRadius: 10,
                            fontWeight: 600,
                            padding: '0 20px',
                            height: 40,
                        }}
                    >
                        {isAddMode ? 'Add Employee' : 'Save Changes'}
                    </Button>,
                ]}
                {...previewModalProps}
            >
                <PreviewModalHeader title={isAddMode ? "Add New Employee" : "Edit Employee"} />

                <div style={{ padding: '16px 0' }}>
                    <Card
                        style={{
                            borderRadius: 12,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            background: '#FAFAFA',
                        }}
                    >
                        <Form layout="vertical" form={form}>
                            <Row gutter={[24, 16]}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Name" name="employeeName">
                                        <Input placeholder="Enter Name" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Designation" name="designation">
                                        <Input placeholder="Enter Designation" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Department" name="department">
                                        <Input placeholder="Enter Department" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Primary Email" name="primaryEmail">
                                        <Input placeholder="Enter Primary Email" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Secondary Email" name="secondaryEmail">
                                        <Input placeholder="Enter Secondary Email" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Bank Name" name="bankName">
                                        <Input placeholder="Enter Bank Name" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Bank Account Number" name="bankAccount">
                                        <Input placeholder="Enter Bank Account Number" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Active Status" name="isActive" valuePropName="checked">
                                        <Switch
                                            checkedChildren="Active"
                                            unCheckedChildren="Inactive"
                                            checked={form.getFieldValue('isActive')}
                                            onChange={(checked) => form.setFieldsValue({ isActive: checked })}
                                            style={{
                                                backgroundColor: form.getFieldValue('isActive') ? primaryColor : secondaryColor,
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            </Modal>

            {/* Employee Profile Modal */}
            <Modal
                open={profileModalOpen}
                width={600}
                footer={null}
                closeIcon={<CustomCloseIcon primaryColor={primaryColor} secondaryColor={secondaryColor} />}
                onCancel={() => setProfileModalOpen(false)}
            >
                <PreviewModalHeader title="Employee Profile" />
                {selectedEmployee && (
                    <Card style={{ borderRadius: 12, background: '#FAFAFA', padding: 16 }}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}><Text strong>Name:</Text> <br />{selectedEmployee.employeeName}</Col>
                            <Col xs={24} md={12}><Text strong>Designation:</Text> <br />{selectedEmployee.designation}</Col>
                            <Col xs={24} md={12}><Text strong>Department:</Text> <br />{selectedEmployee.department}</Col>
                            <Col xs={24} md={12}><Text strong>Date of Joining:</Text> <br />{selectedEmployee.doj}</Col>
                            <Col xs={24} md={12}><Text strong>Primary Email:</Text> <br />{selectedEmployee.primaryEmail}</Col>
                            <Col xs={24} md={12}><Text strong>Secondary Email:</Text> <br />{selectedEmployee.secondaryEmail}</Col>
                            <Col xs={24} md={12}><Text strong>Bank Name:</Text> <br />{selectedEmployee.bankName}</Col>
                            <Col xs={24} md={12}><Text strong>Bank Account:</Text> <br />{maskAccountNumber(selectedEmployee.bankAccount)}</Col>
                            <Col xs={24} md={12}><Text strong>Status:</Text> <br />
                                <Tag color={selectedEmployee.isActive ? 'green' : 'red'}>
                                    {selectedEmployee.isActive ? 'Active' : 'Inactive'}
                                </Tag>
                            </Col>
                        </Row>
                    </Card>
                )}
            </Modal>

            <style jsx>{`
                .hover-row:hover {
                    background-color: ${secondaryColor}20;
                    transition: background-color 0.2s;
                }
            `}</style>
        </div>
    );
}
