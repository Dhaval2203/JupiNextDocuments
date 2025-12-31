'use client';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import PrivateRoute from '../../components/PrivateRoute';

import { showToast } from '@/Utils/toast';
import {
    DownloadOutlined,
    EyeOutlined,
    MailOutlined,
} from '@ant-design/icons';
import { pdf } from '@react-pdf/renderer';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Table,
    Typography,
} from 'antd';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
    accentColor,
    primaryBackgroundColor,
    primaryColor,
    secondaryBackgroundColor,
    secondaryColor,
    whiteColor,
} from '../../Utils/Colors';

import {
    deductionsData,
    earningsData,
    notificationType,
} from '../../Utils/Const';

import {
    CustomCloseIcon,
    PreviewModalHeader,
    previewModalProps,
} from '../../Utils/UIStyles/uiStyles';

import numberToWords from '../../Utils/UtilsFunction';
import { SalarySlipPDF } from './SalarySlipTemplate';
import { getEmployees } from '@/services/employeeApi';

const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);

const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
    { ssr: false }
);

const { Title, Text } = Typography;
const { Option } = Select;

export default function SalarySleepPage() {
    const dispatch = useDispatch();
    const router = useRouter();

    const [employees, setEmployees] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [sending, setSending] = useState(false);

    const [form] = Form.useForm();
    const values = Form.useWatch([], form);
    const slipRef = useRef(null);

    /* ---------------- Fetch Employees ---------------- */
    const fetchEmployees = async () => {
        try {
            setLoadingTable(true);
            const res = await getEmployees();
            setEmployees(res.data || []);
        } catch {
            showToast(notificationType.error, 'Error', 'Failed to load employees');
        } finally {
            setLoadingTable(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    /* ---------------- Working Days ---------------- */
    const getWorkingDaysInMonth = (monthYear) => {
        if (!monthYear) return 0;

        const start = dayjs(monthYear).startOf('month');
        const end = dayjs(monthYear).endOf('month');
        let count = 0;
        let current = start;

        while (current.isBefore(end) || current.isSame(end, 'day')) {
            const day = current.day();
            if (day !== 0 && day !== 6) count++;
            current = current.add(1, 'day');
        }
        return count;
    };

    /* ---------------- Totals ---------------- */
    const totals = useMemo(() => {
        const totalEarnings =
            (values?.basic || 0) +
            (values?.hra || 0) +
            (values?.telephone || 0) +
            (values?.internet || 0) +
            (values?.cityAllowance || 0);

        const totalDeductions =
            (values?.pt || 0) +
            (values?.pf || 0) +
            (values?.esic || 0) +
            (values?.tds || 0) +
            (values?.lop || 0);

        return {
            totalEarnings,
            totalDeductions,
            netPay: totalEarnings - totalDeductions,
        };
    }, [values]);

    /* ---------------- Amount Column ---------------- */
    const amountColumn = () => ({
        title: 'Amount (₹)',
        align: 'right',
        render: (_, record) => (
            <Form.Item name={record.name} style={{ marginBottom: 0 }}>
                <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    controls={false}
                    disabled={!values?.employeeId}
                    parser={(value) =>
                        value?.replace(/[₹,\s]/g, '') || '0'
                    }
                    formatter={(value) =>
                        `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                />
            </Form.Item>
        ),
    });

    /* ---------------- PDF Data ---------------- */
    const salaryPDFData = {
        ...values,
        netPayInWords: numberToWords(totals.netPay),
    };

    /* ---------------- Download PDF ---------------- */
    const generatePDF = async () => {
        const blob = await pdf(
            <SalarySlipPDF data={salaryPDFData} totals={totals} />
        ).toBlob();

        const monthYearText = values.monthYear?.format
            ? values.monthYear.format('MMM_YYYY')
            : dayjs().format('MMM_YYYY');

        saveAs(
            blob,
            `${values.employeeName || 'Employee'}_${monthYearText}.pdf`
        );
    };

    /* ---------------- Send Email ---------------- */
    const sendPDFByEmail = async () => {
        try {
            setSending(true);

            const blob = await pdf(
                <SalarySlipPDF data={salaryPDFData} totals={totals} />
            ).toBlob();

            const monthYearText = values.monthYear?.format
                ? values.monthYear.format('MMM_YYYY')
                : dayjs().format('MMM_YYYY');

            const fileName = `${values.employeeName}_Salary_Slip_${monthYearText}.pdf`;

            const pdfFile = new File([blob], fileName, {
                type: 'application/pdf',
            });

            const emp = employees.find(
                (e) => e.employeeId === values.employeeId
            );

            const formData = new FormData();
            formData.append('file', pdfFile);
            formData.append('monthYear', monthYearText);
            formData.append('employee', JSON.stringify(emp));

            const res = await fetch('/api/send-file', {
                method: 'POST',
                body: formData,
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error);

            showToast(
                notificationType.success,
                'Email Sent',
                'Salary slip has been sent successfully.'
            );
        } catch {
            showToast(
                notificationType.error,
                'Error',
                'Failed to send salary slip email.'
            );
        } finally {
            setSending(false);
        }
    };

    const actionButtonStyle = {
        minWidth: 160,
        height: 44,
        borderRadius: 14,
        fontWeight: 600,
    };

    return (
        <PrivateRoute>
            <Card style={{ borderRadius: 16, background: '#F8FAFC' }}>
                <div ref={slipRef}>
                    {/* Header */}
                    <Card
                        style={{
                            borderRadius: 12,
                            background: primaryColor,
                            marginBottom: 24,
                        }}
                    >
                        <Title level={3} style={{ color: whiteColor, marginBottom: 0 }}>
                            Salary Slip
                        </Title>
                        <Text style={{ color: '#E5E7EB' }}>
                            Monthly Salary Statement
                        </Text>
                    </Card>

                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            monthYear: dayjs(),
                            workedDays: getWorkingDaysInMonth(dayjs()),
                        }}
                        onValuesChange={(changedValues) => {
                            if (changedValues.employeeId) {
                                const emp = employees.find(
                                    (e) => e.employeeId === changedValues.employeeId
                                );
                                if (emp) form.setFieldsValue(emp);
                            }
                            if (changedValues.monthYear) {
                                form.setFieldsValue({
                                    workedDays: getWorkingDaysInMonth(
                                        changedValues.monthYear
                                    ),
                                });
                            }
                        }}
                    >
                        {/* Month & Employee */}
                        <Card style={{ borderRadius: 12, marginBottom: 24 }}>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={6}>
                                    <Form.Item label="Salary Month" name="monthYear" required>
                                        <DatePicker picker="month" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item label="Employee" name="employeeId" required>
                                        <Select placeholder="Select Employee">
                                            {employees.map((emp) => (
                                                <Option key={emp.employeeId} value={emp.employeeId}>
                                                    {emp.employeeId} - {emp.employeeName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={6}>
                                    <Form.Item label="Working Days" name="workedDays">
                                        <InputNumber min={0} max={31} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        {/* Employee Details */}
                        <Card title="Employee Details" style={{ borderRadius: 12, marginBottom: 24 }}>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={6}>
                                    <Form.Item label="Name" name="employeeName">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={6}>
                                    <Form.Item label="Designation" name="designation">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={6}>
                                    <Form.Item label="Department" name="department">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={6}>
                                    <Form.Item label="Date of Joining" name="doj">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        {/* Earnings & Deductions */}
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Card
                                    title="Earnings"
                                    style={{
                                        borderRadius: 12,
                                        background: primaryBackgroundColor,
                                    }}
                                >
                                    <Table
                                        size="small"
                                        pagination={false}
                                        dataSource={earningsData}
                                        columns={[
                                            { title: 'Type', dataIndex: 'label' },
                                            amountColumn(),
                                        ]}
                                        rowKey="key"
                                    />
                                </Card>
                            </Col>

                            <Col xs={24} md={12}>
                                <Card
                                    title="Deductions"
                                    style={{
                                        borderRadius: 12,
                                        background: secondaryBackgroundColor,
                                    }}
                                >
                                    <Table
                                        size="small"
                                        pagination={false}
                                        dataSource={deductionsData}
                                        columns={[
                                            { title: 'Type', dataIndex: 'label' },
                                            amountColumn(),
                                        ]}
                                        rowKey="key"
                                    />
                                </Card>
                            </Col>
                        </Row>

                        {/* Net Pay */}
                        <Card
                            style={{
                                borderRadius: 14,
                                marginTop: 24,
                                background: '#F0FDF4',
                                border: `1px solid ${accentColor}`,
                            }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col md={8}>
                                    <Text>Total Earnings</Text><br />
                                    <Text strong>₹ {totals.totalEarnings.toLocaleString()}</Text>
                                </Col>
                                <Col md={8}>
                                    <Text>Total Deductions</Text><br />
                                    <Text strong>₹ {totals.totalDeductions.toLocaleString()}</Text>
                                </Col>
                                <Col md={8}>
                                    <Text strong style={{ fontSize: 22, color: accentColor }}>
                                        ₹ {totals.netPay.toLocaleString()}
                                    </Text>
                                    <br />
                                    <Text type="secondary">
                                        ({numberToWords(totals.netPay)})
                                    </Text>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </div>

                {/* Actions */}
                <Row justify="end" gutter={[12, 12]} style={{ marginTop: 20 }}>
                    <Col>
                        <Button
                            icon={<EyeOutlined />}
                            style={{ ...actionButtonStyle, background: primaryColor, color: whiteColor }}
                            onClick={() => setPreviewVisible(true)}
                        >
                            Preview
                        </Button>
                    </Col>

                    <Col>
                        <Button
                            icon={<DownloadOutlined />}
                            style={{ ...actionButtonStyle, background: secondaryColor, color: whiteColor }}
                            onClick={generatePDF}
                        >
                            Download PDF
                        </Button>
                    </Col>

                    <Col>
                        <Button
                            icon={<MailOutlined />}
                            loading={sending}
                            style={{ ...actionButtonStyle, background: accentColor, color: whiteColor }}
                            onClick={sendPDFByEmail}
                        >
                            Send Email
                        </Button>
                    </Col>
                </Row>

                {/* Preview Modal */}
                <Modal
                    open={previewVisible}
                    onCancel={() => setPreviewVisible(false)}
                    {...previewModalProps}
                    closeIcon={
                        <CustomCloseIcon
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                        />
                    }
                >
                    <PreviewModalHeader title="Salary Slip Preview" />
                    <PDFViewer width="100%" height="90%">
                        <SalarySlipPDF data={salaryPDFData} totals={totals} />
                    </PDFViewer>
                </Modal>
            </Card>
        </PrivateRoute>
    );
}
