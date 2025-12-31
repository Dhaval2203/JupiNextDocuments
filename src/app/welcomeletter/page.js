'use client';
import FooterComponent from '@/components/Footer';
import Headers from '@/components/Header';
import WelcomeLetterScreen from '@/components/WelcomeLetter/WelcomeLetterScreen';

export default function WelcomeLetterPage() {
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
                <WelcomeLetterScreen />
            </div>
            <FooterComponent />
        </>
    );
}
