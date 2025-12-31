'use client';

import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import {
    Button,
    Card,
    Modal,
    Typography,
} from 'antd';
import { useState } from 'react';

import WelcomeLetterTemplate from './WelcomeLetterTemplate';
import PrivateRoute from '../PrivateRoute';

import {
    primaryColor,
    secondaryColor,
    whiteColor,
} from '../../Utils/Colors';

import {
    CustomCloseIcon,
    PreviewModalHeader,
    previewModalProps,
} from '../../Utils/UIStyles/uiStyles';

const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);

const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
    { ssr: false }
);

const { Title, Text } = Typography;

/* ================= ACTION BUTTON STYLE ================= */
const actionButtonStyle = {
    minWidth: 180,
    paddingInline: 22,
    height: 46,
    borderRadius: 14,
    fontWeight: 600,
};

/* ================= CTO DATA ================= */
const CTO_DATA = {
    employeeName: 'Deepali Shrivastava',
    position: 'Chief Technology Officer (CTO)',
};

export default function WelcomeLetterScreen() {
    // ✅ Modal opens ONLY on click
    const [previewVisible, setPreviewVisible] = useState(false);

    return (
        <PrivateRoute>
            <div
                style={{
                    paddingTop:
                        typeof window !== 'undefined' && window.innerWidth < 768
                            ? 64
                            : 80,
                    paddingInline: 16,
                    background: '#F8FAFC',
                    minHeight: '100vh',
                }}
            >
                <Card
                    style={{
                        borderRadius: 16,
                        background: '#F8FAFC',
                        maxWidth: 1200,
                        margin: '0 auto',
                        textAlign: 'center',
                    }}
                >
                    {/* ================= HEADER ================= */}
                    <Card
                        style={{
                            borderRadius: 12,
                            background: primaryColor,
                            marginBottom: 24,
                        }}
                    >
                        <Title level={3} style={{ color: whiteColor, marginBottom: 0 }}>
                            Welcome CTO
                        </Title>
                        <Text style={{ color: whiteColor }}>
                            Official CTO Welcome Letter
                        </Text>
                    </Card>

                    {/* ================= ACTION BUTTONS ================= */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                        <Button
                            icon={<EyeOutlined />}
                            style={{
                                ...actionButtonStyle,
                                backgroundColor: primaryColor,
                                color: whiteColor,
                            }}
                            onClick={() => setPreviewVisible(true)}
                        >
                            Preview Letter
                        </Button>

                        <PDFDownloadLink
                            document={<WelcomeLetterTemplate {...CTO_DATA} />}
                            fileName="Welcome_Letter_CTO.pdf"
                        >
                            <Button
                                icon={<DownloadOutlined />}
                                style={{
                                    ...actionButtonStyle,
                                    backgroundColor: secondaryColor,
                                    color: whiteColor,
                                }}
                            >
                                Download Letter
                            </Button>
                        </PDFDownloadLink>
                    </div>

                    {/* ================= PREVIEW MODAL ================= */}
                    <Modal
                        open={previewVisible}
                        footer={null}
                        {...previewModalProps}
                        closeIcon={
                            <CustomCloseIcon
                                primaryColor={primaryColor}
                                secondaryColor={secondaryColor}
                            />
                        }
                        onCancel={() => setPreviewVisible(false)}
                    >
                        <PreviewModalHeader title="CTO Welcome Letter Preview" />

                        <PDFViewer width="100%" height="90%">
                            <WelcomeLetterTemplate {...CTO_DATA} />
                        </PDFViewer>
                    </Modal>
                </Card>
            </div>
        </PrivateRoute>
    );
}
