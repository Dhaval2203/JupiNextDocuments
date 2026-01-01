'use client';

import dynamic from 'next/dynamic';
import {
    Button,
    Layout,
    Popconfirm,
    Avatar,
    Popover,
} from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { TiThMenuOutline } from 'react-icons/ti';
import {
    primaryColor,
    secondaryColor,
    whiteColor,
} from '../Utils/Colors';
import { menuItems } from '../Utils/Const';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const { Header } = Layout;

const ClientMenu = dynamic(
    () => import('antd').then((m) => m.Menu),
    { ssr: false }
);

const ClientDrawer = dynamic(
    () => import('antd').then((m) => m.Drawer),
    { ssr: false }
);

import dayjs from 'dayjs';

export default function Headers() {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    /* ================= AUTH DATA ================= */
    const { employee } = useSelector((state) => state.auth);

    const [selectedKey, setSelectedKey] = useState('salarysleep');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        const activeItem = menuItems.find((item) =>
            pathname === '/'
                ? item.key === 'salarysleep'
                : pathname.startsWith(item.key)
        );

        if (activeItem) {
            window.requestAnimationFrame(() => {
                setSelectedKey(activeItem.key);
            });
        }
    }, [pathname]);

    const formatDate = (date) => {
        if (!date) return '—';
        return dayjs(date).format('DD/MMM/YYYY');
    };

    const handleMenuClick = ({ key }) => {
        setSelectedKey(key);
        setDrawerOpen(false);
        router.push(key);
    };

    /* ================= LOGOUT (UNCHANGED) ================= */
    const handleLogout = () => {
        dispatch(logout());
        setDrawerOpen(false);
        router.replace('/login');
    };

    const desktopMenuItems = menuItems.map((item) => ({
        key: item.key,
        label: (
            <span
                style={{
                    position: 'relative',
                    color: selectedKey === item.key ? primaryColor : '#333',
                    fontWeight: selectedKey === item.key ? 600 : 400,
                    paddingBottom: 4,
                    cursor: 'pointer',
                }}
            >
                {item.label}
                {selectedKey === item.key && (
                    <span
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: 2,
                            backgroundColor: primaryColor,
                        }}
                    />
                )}
            </span>
        ),
    }));

    /* ================= PROFILE POPUP CONTENT ================= */
    const profileContent = employee && (
        <div
            style={{
                width: 320,
                borderRadius: 12,
                overflow: 'hidden',
                background: whiteColor,
            }}
        >
            {/* ===== HEADER ===== */}
            <div
                style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    padding: '16px',
                    color: whiteColor,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                        size={56}
                        style={{
                            backgroundColor: whiteColor,
                            color: primaryColor,
                            fontWeight: 700,
                            fontSize: 22,
                        }}
                    >
                        {employee.employeeName?.charAt(0)?.toUpperCase()}
                    </Avatar>

                    <div>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>
                            {employee.employeeName}
                        </div>
                        <div style={{ fontSize: 13, opacity: 0.9 }}>
                            {employee.designation}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== DATA SECTION ===== */}
            <div
                style={{
                    padding: '14px 16px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                }}
            >
                <DataItem label="Employee ID" value={employee.employeeId} />
                <DataItem label="Department" value={employee.department} />

                {/* ✅ REPORTING MANAGER */}
                {/* <DataItem
                    label="Reporting Manager"
                    value={
                        employee.reportingManagerName
                            ? `${employee.reportingManagerName}${employee.reportingManagerId ? ` (${employee.reportingManagerId})` : ''}`
                            : '—'
                    }
                /> */}
                <DataItem
                    label="Date of Joining"
                    value={formatDate(employee.dateOfJoining)}
                />
                <DataItem
                    label="Date of Birth"
                    value={formatDate(employee.dateOfBirth)}
                />

                <DataItem
                    label="Primary Email"
                    value={employee.primaryEmail}
                    full
                />
                <DataItem
                    label="Secondary Email"
                    value={employee.secondaryEmail}
                    full
                />

                <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                    <div
                        style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: '#999',
                            marginBottom: 6,
                        }}
                    >
                        Bank Details
                    </div>
                </div>

                <DataItem label="Bank Name" value={employee.bankName} />
                <DataItem
                    label="Account No."
                    value={
                        employee.bankAccount
                            ? `XXXX XXXX ${employee.bankAccount.slice(-4)}`
                            : ''
                    }
                />
            </div>
        </div>
    );

    return (
        <Header
            suppressHydrationWarning
            style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 1000,
                background: whiteColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                height: 80,
            }}
        >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Image
                    src="/JupiNextIcon.png"
                    alt="JupiNext Logo"
                    width={50}
                    height={50}
                />
                <Image
                    src="/JupiNextName.png"
                    alt="JupiNext Name Logo"
                    width={250}
                    height={100}
                />
            </div>

            {/* Desktop Menu */}
            <div
                className="desktop-menu"
                style={{ display: 'flex', alignItems: 'center', gap: 16 }}
            >
                <ClientMenu
                    mode="horizontal"
                    disabledOverflow
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                    items={desktopMenuItems}
                    style={{ borderBottom: 'none' }}
                />

                {/* Profile Popup */}
                {employee && (
                    <Popover
                        content={profileContent}
                        trigger="click"
                        placement="bottomRight"
                        open={profileOpen}
                        onOpenChange={setProfileOpen}
                        styles={{
                            body: {
                                padding: 0,
                                width: 420,   // 👈 FULL popover width
                            },
                        }}
                    >
                        <Avatar
                            style={{
                                backgroundColor: primaryColor,
                                cursor: 'pointer',
                                fontWeight: 600,
                            }}
                        >
                            {employee.employeeName?.charAt(0)?.toUpperCase()}
                        </Avatar>
                    </Popover>
                )}

                {/* Logout Button (UNCHANGED) */}
                <Popconfirm
                    title="Logout"
                    description="Are you sure you want to logout?"
                    onConfirm={handleLogout}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        type="primary"
                        danger
                        style={{ borderRadius: 8 }}
                    >
                        Logout
                    </Button>
                </Popconfirm>
            </div>

            {/* Mobile Menu Button */}
            <Button
                className="mobile-menu-btn"
                type="text"
                icon={
                    <TiThMenuOutline
                        style={{ color: secondaryColor, fontSize: 28 }}
                    />
                }
                onClick={() => setDrawerOpen(true)}
            />

            {/* Mobile Drawer (UNCHANGED) */}
            <ClientDrawer
                placement="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                {menuItems.map((item) => (
                    <div
                        key={item.key}
                        onClick={() => handleMenuClick({ key: item.key })}
                        style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                        }}
                    >
                        {item.label}
                    </div>
                ))}

                <Button
                    danger
                    block
                    style={{ marginTop: 24 }}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </ClientDrawer>
        </Header>
    );
}

/* ================= DATA ITEM ================= */
function DataItem({ label, value, full = false }) {
    if (!value) return null;

    return (
        <div
            style={{
                gridColumn: full ? '1 / -1' : undefined,
                background: '#fafafa',
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                padding: '10px 12px',
            }}
        >
            <div
                style={{
                    fontSize: 11,
                    color: '#888',
                    marginBottom: 4,
                }}
            >
                {label}
            </div>
            <div
                style={{
                    fontSize: 14,
                    fontWeight: 500,
                    wordBreak: 'break-word',
                }}
            >
                {value}
            </div>
        </div>
    );
}
