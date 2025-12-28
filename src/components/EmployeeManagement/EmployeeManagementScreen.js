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
    Spin,
    message,
} from 'antd';
import {
    EditOutlined,
    FileExcelOutlined,
    PlusOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';

import {
    primaryColor,
    secondaryColor,
    whiteColor,
} from '../../Utils/Colors';

import {
    CustomCloseIcon,
    PreviewModalHeader,
    previewModalProps,
} from '@/Utils/UIStyles/uiStyles';

import DashboardStats from './DashboardStats';
import {
    getEmployees,
    addEmployee,
    updateEmployee,
} from '@/services/employeeApi';

const { Title, Text } = Typography;
const { Search } = Input;

const maskAccountNumber = (account = '') =>
    account ? `XXXX XXXX ${account.slice(-5)}` : '';

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [savingEmployee, setSavingEmployee] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [designationFilter, setDesignationFilter] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    const [form] = Form.useForm();

    /* ================= FETCH EMPLOYEES ================= */
    const fetchEmployees = async () => {
        try {
            setLoadingTable(true);
            const res = await getEmployees();
            setEmployees(res.data || []);
        } catch {
            message.error('Failed to load employees');
        } finally {
            setLoadingTable(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    /* ================= DATASOURCE ================= */
    const dataSource = useMemo(
        () =>
            employees.map((emp) => ({
                ...emp,
                key: emp._id,
                status: emp.isActive ? 'Active' : 'Inactive',
            })),
        [employees]
    );

    /* ================= FILTERS ================= */
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

    /* ================= HANDLERS ================= */
    const handleEdit = (record) => {
        setIsAddMode(false);
        setSelectedEmployee(record);
        form.setFieldsValue(record);
        setEditModalOpen(true);
    };

    const handleAddNew = () => {
        setIsAddMode(true);
        setSelectedEmployee(null);
        form.resetFields();
        form.setFieldsValue({ isActive: true });
        setEditModalOpen(true);
    };

    const handleViewProfile = (record) => {
        setSelectedEmployee(record);
        setProfileModalOpen(true);
    };

    const handleExportExcel = () => {
        message.info('Excel export coming soon');
    };

    /* ================= SAVE EMPLOYEE ================= */
    const handleSaveEmployee = async (values) => {
        try {
            setSavingEmployee(true);

            if (isAddMode) {
                await addEmployee(values);
                message.success('Employee added successfully');
            } else {
                await updateEmployee(selectedEmployee._id, values);
                message.success('Employee updated successfully');
            }

            setEditModalOpen(false);
            fetchEmployees();
        } catch {
            message.error('Failed to save employee');
        } finally {
            setSavingEmployee(false);
        }
    };

    /* ================= TABLE COLUMNS ================= */
    const columns = [
        {
            title: 'Employee ID',
            dataIndex: 'employeeId',
            sorter: (a, b) => a.employeeId?.localeCompare(b.employeeId),
        },
        {
            title: 'Name',
            dataIndex: 'employeeName',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
        },
        {
            title: 'Department',
            dataIndex: 'department',
        },
        {
            title: 'Bank Details',
            render: (_, record) => (
                <Text>
                    {record.bankName} ({maskAccountNumber(record.bankAccount)})
                </Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={status === 'Active' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            align: 'center',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewProfile(record)}
                        style={{ color: secondaryColor }}
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={{ color: primaryColor }}
                    />
                </div>
            ),
        },
    ];

    const designations = useMemo(
        () => [...new Set(employees.map((e) => e.designation).filter(Boolean))],
        [employees]
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div style={{ paddingTop: 80, paddingInline: 16 }}>
                <DashboardStats dataSource={dataSource} />

                <Card style={{ maxWidth: 1400, margin: '0 auto', borderRadius: 16 }}>
                    <Card style={{ background: primaryColor, marginBottom: 24 }}>
                        <Title level={3} style={{ color: whiteColor }}>
                            Employee Management
                        </Title>
                        <Text style={{ color: '#E5E7EB' }}>
                            Search, filter, edit, add, and manage employees
                        </Text>
                    </Card>

                    {/* FILTERS + ACTIONS */}
                    <Card style={{ marginBottom: 24 }}>
                        <Row gutter={[16, 16]} align="bottom">
                            <Col xs={24} md={6}>
                                <Text strong>Search Employee</Text>
                                <Search
                                    allowClear
                                    placeholder="Employee ID or Name"
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </Col>

                            <Col xs={24} md={6}>
                                <Text strong>Designation</Text>
                                <Select
                                    mode="multiple"
                                    allowClear
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
                                <Text strong>Status</Text>
                                <Select
                                    allowClear
                                    style={{ width: '100%' }}
                                    onChange={setStatusFilter}
                                >
                                    <Select.Option value="Active">Active</Select.Option>
                                    <Select.Option value="Inactive">Inactive</Select.Option>
                                </Select>
                            </Col>

                            <Col
                                xs={24}
                                md={6}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 8,
                                }}
                            >
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={handleAddNew}
                                    style={{
                                        backgroundColor: whiteColor,
                                        color: secondaryColor,
                                        borderColor: secondaryColor,
                                    }}
                                />
                                <Button
                                    icon={<FileExcelOutlined />}
                                    onClick={handleExportExcel}
                                    style={{
                                        backgroundColor: whiteColor,
                                        color: primaryColor,
                                        borderColor: primaryColor,
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card>

                    {/* TABLE */}
                    <Table
                        loading={loadingTable}
                        columns={columns}
                        dataSource={filteredData}
                        pagination={{ pageSize: 10 }}
                        bordered
                    />
                </Card>
            </div>

            {/* ADD / EDIT EMPLOYEE MODAL */}
            <Modal
                open={editModalOpen}
                width={800}
                closeIcon={
                    <CustomCloseIcon
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    />
                }
                onCancel={() => {
                    setEditModalOpen(false);
                    form.resetFields();
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setEditModalOpen(false);
                            form.resetFields();
                        }}
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
                        loading={savingEmployee}
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
                <PreviewModalHeader
                    title={isAddMode ? 'Add New Employee' : 'Edit Employee'}
                />

                <div style={{ padding: '16px 0' }}>
                    <Card
                        style={{
                            borderRadius: 12,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            background: '#FAFAFA',
                        }}
                    >
                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={handleSaveEmployee}
                        >
                            <Row gutter={[24, 16]}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Employee ID"
                                        name="employeeId"
                                        rules={[{ required: true, message: 'Employee ID is required' }]}
                                    >
                                        <Input placeholder="Enter Employee ID" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Name"
                                        name="employeeName"
                                        rules={[{ required: true, message: 'Name is required' }]}
                                    >
                                        <Input placeholder="Enter Name" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Designation"
                                        name="designation"
                                        rules={[{ required: true, message: 'Designation is required' }]}
                                    >
                                        <Input placeholder="Enter Designation" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Department"
                                        name="department"
                                    >
                                        <Input placeholder="Enter Department" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Primary Email"
                                        name="primaryEmail"
                                        rules={[
                                            { type: 'email', message: 'Enter valid email' },
                                        ]}
                                    >
                                        <Input placeholder="Enter Primary Email" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Secondary Email"
                                        name="secondaryEmail"
                                    >
                                        <Input placeholder="Enter Secondary Email" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Bank Name"
                                        name="bankName"
                                    >
                                        <Input placeholder="Enter Bank Name" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Bank Account Number"
                                        name="bankAccount"
                                    >
                                        <Input placeholder="Enter Bank Account Number" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Active Status"
                                        name="isActive"
                                        valuePropName="checked"
                                        initialValue
                                    >
                                        <Switch
                                            checkedChildren="Active"
                                            unCheckedChildren="Inactive"
                                            onChange={(checked) =>
                                                form.setFieldsValue({ isActive: checked })
                                            }
                                            style={{
                                                backgroundColor: form.getFieldValue('isActive')
                                                    ? primaryColor
                                                    : secondaryColor,
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            </Modal>
        </div>
    );
}
