import {
    Modal,
    Form,
    Row,
    Col,
    Input,
    DatePicker,
    Button,
    Switch,
    Select,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';

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

export default function EmployeeFormModal({
    open,
    isAddMode,
    employee,
    employees = [],
    loading,
    onClose,
    onSave,
}) {
    const [form] = Form.useForm();

    const compactItemStyle = { marginBottom: 10 };

    /* ================= PREFILL ON EDIT ================= */
    useEffect(() => {
        if (employee && open) {
            form.setFieldsValue({
                ...employee,
                dateOfBirth: employee.dateOfBirth
                    ? dayjs(employee.dateOfBirth)
                    : null,
                dateOfJoining: employee.dateOfJoining
                    ? dayjs(employee.dateOfJoining)
                    : null,
                // password: '', // never prefill password
            });
        }
    }, [employee, open, form]);

    const handleFinish = (values) => {
        onSave({
            ...values,
            dateOfBirth: values.dateOfBirth?.toISOString(),
            dateOfJoining: values.dateOfJoining?.toISOString(),
        });
    };

    return (
        <Modal
            open={open}
            centered
            destroyOnClose
            closable
            width="100%"
            closeIcon={
                <CustomCloseIcon
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                />
            }
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            footer={null}
            style={{ maxWidth: 900, margin: '0 auto' }}
            styles={{
                body: {
                    padding: '12px 16px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                },
            }}
            {...previewModalProps}
        >
            <PreviewModalHeader
                title={isAddMode ? 'Add New Employee' : 'Edit Employee'}
            />

            <Form
                layout="vertical"
                form={form}
                onFinish={handleFinish}
            >
                <Row gutter={[16, 8]}>
                    {/* Employee ID */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Employee ID"
                            name="employeeId"
                            rules={[{ required: true }]}
                            style={compactItemStyle}
                        >
                            <Input placeholder="Enter employee ID (e.g. JN-001)" />
                        </Form.Item>
                    </Col>

                    {/* Name */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Employee Name"
                            name="employeeName"
                            rules={[{ required: true }]}
                            style={compactItemStyle}
                        >
                            <Input placeholder="Enter full name" />
                        </Form.Item>
                    </Col>

                    {/* Password */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={isAddMode ? [{ required: true, min: 6 }] : []}
                            style={compactItemStyle}
                        >
                            <Input.Password placeholder="Enter password" />
                        </Form.Item>
                    </Col>

                    {/* Designation */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Designation"
                            name="designation"
                            rules={[{ required: true }]}
                            style={compactItemStyle}
                        >
                            <Input placeholder="e.g. Software Engineer" />
                        </Form.Item>
                    </Col>

                    {/* Department */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Department"
                            name="department"
                            style={compactItemStyle}
                        >
                            <Input placeholder="e.g. Engineering" />
                        </Form.Item>
                    </Col>

                    {/* Reporting Manager */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Reporting Manager"
                            name="reportingManagerId"
                            style={compactItemStyle}
                        >
                            <Select
                                allowClear
                                placeholder="Select reporting manager"
                            >
                                {employees
                                    .filter(e => e.id !== employee?.id)
                                    .map(emp => (
                                        <Select.Option key={emp.id} value={emp.id}>
                                            {emp.employeeName} ({emp.employeeId})
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* Date of Birth */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Date of Birth"
                            name="dateOfBirth"
                            rules={[{ required: true }]}
                            style={compactItemStyle}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="Select date of birth"
                            />
                        </Form.Item>
                    </Col>

                    {/* Date of Joining */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Date of Joining"
                            name="dateOfJoining"
                            style={compactItemStyle}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="Select joining date"
                            />
                        </Form.Item>
                    </Col>

                    {/* Primary Email */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Primary Email"
                            name="primaryEmail"
                            rules={[{ type: 'email', required: true }]}
                            style={compactItemStyle}
                        >
                            <Input placeholder="official email address" />
                        </Form.Item>
                    </Col>

                    {/* Secondary Email */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Secondary Email"
                            name="secondaryEmail"
                            style={compactItemStyle}
                        >
                            <Input placeholder="personal email (optional)" />
                        </Form.Item>
                    </Col>

                    {/* Bank Name */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Bank Name"
                            name="bankName"
                            style={compactItemStyle}
                        >
                            <Input placeholder="e.g. HDFC Bank" />
                        </Form.Item>
                    </Col>

                    {/* Bank Account */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Bank Account Number"
                            name="bankAccount"
                            style={compactItemStyle}
                        >
                            <Input placeholder="Enter account number" />
                        </Form.Item>
                    </Col>

                    {/* Active Status */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Active Status"
                            name="isActive"
                            valuePropName="checked"
                            initialValue={true}
                            style={compactItemStyle}
                        >
                            <Switch
                                checkedChildren="Active"
                                unCheckedChildren="Inactive"
                            />
                        </Form.Item>
                    </Col>

                    {/* Actions */}
                    <Col xs={24}>
                        <Row gutter={[12, 12]}>
                            <Col xs={24} sm={12}>
                                <Button
                                    block
                                    onClick={() => {
                                        form.resetFields();
                                        onClose();
                                    }}
                                    style={{
                                        background: whiteColor,
                                        color: primaryColor,
                                        border: `1px solid ${primaryColor}`,
                                        borderRadius: 10,
                                        fontWeight: 600,
                                        height: 40,
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Button
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                    style={{
                                        background: primaryColor,
                                        color: whiteColor,
                                        borderRadius: 10,
                                        fontWeight: 600,
                                        height: 40,
                                    }}
                                >
                                    {isAddMode ? 'Add Employee' : 'Save Changes'}
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
