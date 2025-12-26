'use client';
import FooterComponent from '@/components/Footer';
import Headers from '@/components/Header';
import OfferLetterScrren from '@/components/OfferletterPage/OfferletterScreen';

export default function OfferletterPage() {
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
                <OfferLetterScrren />
            </div>
            <FooterComponent />
        </>
    );
}
