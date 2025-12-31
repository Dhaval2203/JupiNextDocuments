'use client';

import dynamic from 'next/dynamic';
import { Button, Layout, Popconfirm } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { TiThMenuOutline } from 'react-icons/ti';
import { CiSquareCheck } from 'react-icons/ci';
import {
    accentColor,
    primaryColor,
    secondaryColor,
    whiteColor,
} from '../Utils/Colors';
import { menuItems } from '../Utils/Const';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
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

// Utility: hex → rgba
const hexToRgba = (hex, opacity = 0.2) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function Headers() {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const [selectedKey, setSelectedKey] = useState('salarysleep');
    const [drawerOpen, setDrawerOpen] = useState(false);

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

    const handleMenuClick = ({ key }) => {
        setSelectedKey(key);
        setDrawerOpen(false);
        router.push(key);
    };

    /* ================= LOGOUT ================= */
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
                <Image src="/JupiNextIcon.png" alt="JupiNext Logo" width={50} height={50} />
                <Image src="/JupiNextName.png" alt="JupiNext Name Logo" width={250} height={100} />
            </div>

            {/* Desktop Menu */}
            <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <ClientMenu
                    mode="horizontal"
                    disabledOverflow
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                    items={desktopMenuItems}
                    style={{ borderBottom: 'none' }}
                />

                {/* Logout Button */}
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
                icon={<TiThMenuOutline style={{ color: secondaryColor, fontSize: 28 }} />}
                onClick={() => setDrawerOpen(true)}
            />

            {/* Mobile Drawer */}
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

                {/* Mobile Logout */}
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
