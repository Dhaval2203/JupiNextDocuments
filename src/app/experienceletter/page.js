'use client';
import FooterComponent from '@/components/Footer';
import Headers from '@/components/Header';
import ExperienceLetter from '@/components/ExperienceLetter/ExperienceLetterScreen';

export default function ExperienceLetterPage() {
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
                <ExperienceLetter />
            </div>
            <FooterComponent />
        </>
    );
}
