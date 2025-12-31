'use client';

import {
    primaryColor,
    secondaryColor,
} from '@/Utils/Colors';

export default function JupiNextLoader({ done = false }) {
    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                {[0, 1, 2, 3, 4].map((i) => (
                    <span
                        key={i}
                        style={{
                            ...styles.node,
                            background: done ? primaryColor : secondaryColor,
                            opacity: done ? 1 : 0.35,
                            animation: done
                                ? 'none'
                                : 'recursiveFill 2s ease-in-out infinite',
                            animationDelay: `${i * 0.25}s`,
                            transform: done ? 'scale(1)' : undefined,
                        }}
                    />
                ))}
            </div>

            <div style={styles.brand}>
                <span style={{ color: primaryColor }}>Jupi</span>
                <span style={{ color: secondaryColor }}>Next</span>
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 14,
    },

    container: {
        display: 'flex',
        gap: 14,
        alignItems: 'center',
    },

    node: {
        width: 14,
        height: 14,
        borderRadius: '50%',
        transition: 'all 0.4s ease', // 👈 smooth stop
    },

    brand: {
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: 0.4,
    },
};
