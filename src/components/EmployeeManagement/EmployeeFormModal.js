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

const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 72;

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
            // width="100%"
            footer={null}
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
            style={{ maxWidth: 900, margin: '0 auto' }}
            styles={{
                body: {
                    padding: 0,
                },
            }}
            {...previewModalProps}
        >
            {/* ================= GRID LAYOUT ================= */}
            <div
                style={{
                    height: '80vh',
                    display: 'grid',
                    gridTemplateRows: `${HEADER_HEIGHT}px 1fr ${FOOTER_HEIGHT}px`,
                    background: whiteColor,
                }}
            >
                {/* ================= HEADER ================= */}
                <div
                    style={{
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        height: HEADER_HEIGHT,
                        background: whiteColor,
                    }}
                >
                    <div style={{ padding: '12px 16px', width: '100%' }}>
                        <PreviewModalHeader
                            title={isAddMode ? 'Add New Employee' : 'Edit Employee'}
                        />
                    </div>
                </div>

                {/* ================= SCROLLABLE BODY ================= */}
                <div
                    style={{
                        overflowY: 'auto',
                        padding: '12px 16px',
                    }}
                >
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleFinish}
                    >
                        <Row gutter={[16, 8]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Employee ID"
                                    name="employeeId"
                                    rules={[{ required: true }]}
                                    style={compactItemStyle}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Employee Name"
                                    name="employeeName"
                                    rules={[{ required: true }]}
                                    style={compactItemStyle}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={isAddMode ? [{ required: true, min: 6 }] : []}
                                    style={compactItemStyle}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Designation"
                                    name="designation"
                                    rules={[{ required: true }]}
                                    style={compactItemStyle}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Department"
                                    name="department"
                                    style={compactItemStyle}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Reporting Manager"
                                    name="reportingManagerId"
                                    style={compactItemStyle}
                                >
                                    <Select allowClear>
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

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    rules={[{ required: true }]}
                                    style={compactItemStyle}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Date of Joining"
                                    name="dateOfJoining"
                                    style={compactItemStyle}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Primary Email"
                                    name="primaryEmail"
                                    rules={[{ type: 'email', required: true }]}
                                    style={compactItemStyle}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Secondary Email"
                                    name="secondaryEmail"
                                    style={compactItemStyle}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Bank Name"
                                    name="bankName"
                                    style={compactItemStyle}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Bank Account Number"
                                    name="bankAccount"
                                    style={compactItemStyle}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Active Status"
                                    name="isActive"
                                    valuePropName="checked"
                                    initialValue={true}
                                    style={compactItemStyle}
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>

                {/* ================= FOOTER ================= */}
                <div
                    style={{
                        padding: '12px 16px',
                        borderTop: '1px solid #f0f0f0',
                        background: whiteColor,
                    }}
                >
                    <Row justify="end" gutter={12}>
                        <Col>
                            <Button
                                size="middle"
                                onClick={() => {
                                    form.resetFields();
                                    onClose();
                                }}
                                style={{
                                    background: whiteColor,
                                    color: secondaryColor,
                                    border: `1px solid ${secondaryColor}`,
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    minWidth: 110,
                                }}
                            >
                                Cancel
                            </Button>
                        </Col>

                        <Col>
                            <Button
                                type="primary"
                                size="middle"
                                loading={loading}
                                onClick={() => form.submit()}
                                style={{
                                    background: primaryColor,
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    minWidth: 140,
                                }}
                            >
                                {isAddMode ? 'Add Employee' : 'Save Changes'}
                            </Button>
                        </Col>
                    </Row>
                </div>

            </div>
        </Modal>
    );
}
