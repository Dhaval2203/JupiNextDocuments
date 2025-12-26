'use client';
import FooterComponent from '@/components/Footer';
import Headers from '@/components/Header';
import SalarySleepScreen from '@/components/SalarySleep/SalarySleepScreen';

export default function SalarySleepPage() {
    return (
        <>
            <Headers />
            <div
                style={{
                    paddingTop: typeof window !== 'undefined' && window.innerWidth < 768 ? 64 : 80,
                    paddingInline: 12,
                    minHeight: '100vh',
                }}
            >
                <SalarySleepScreen />
            </div>
            <FooterComponent />
        </>
    );
}
