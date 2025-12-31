import {
    Document,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
} from '@react-pdf/renderer';
import dayjs from 'dayjs';
import {
    primaryBackgroundColor,
    primaryColor,
    secondaryColor,
    textColor
} from '../../Utils/Colors';

const secondaryBackgroundColorForLetter = "#F58888"
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
        lineHeight: 1.6,
        position: 'relative',
        color: textColor,
    },

    /* ===== Decorative Bars ===== */
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 12,
        backgroundColor: primaryColor,
    },

    bottomBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 12,
        backgroundColor: primaryColor,
    },

    sideBarLeft: {
        position: 'absolute',
        top: 12,
        bottom: 12,
        left: 0,
        width: 10,
        backgroundColor: secondaryBackgroundColorForLetter,
    },

    sideBarRight: {
        position: 'absolute',
        top: 12,
        bottom: 12,
        right: 0,
        width: 10,
        backgroundColor: secondaryBackgroundColorForLetter,
    },

    /* ===== Layout ===== */
    header: {
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 10,
    },

    logo: {
        width: 150,
        height: 'auto',
    },

    content: {
        zIndex: 1,
    },

    titleWrapper: {
        backgroundColor: primaryBackgroundColor,
        paddingVertical: 10,
        marginBottom: 20,
        borderRadius: 6,
    },

    title: {
        fontSize: 18,
        textAlign: 'center',
        color: secondaryColor,
        fontWeight: 'bold',
        letterSpacing: 1.2,
    },

    section: {
        marginBottom: 12,
    },

    highlightBox: {
        backgroundColor: primaryBackgroundColor,
        padding: 12,
        borderRadius: 6,
        marginBottom: 16,
    },

    boldPrimary: {
        fontWeight: 'bold',
        color: primaryColor,
    },

    divider: {
        height: 1,
        backgroundColor: primaryColor,
        opacity: 0.3,
        marginVertical: 16,
    },

    footer: {
        marginTop: 20,
    },

    signature: {
        marginTop: 16,
    },

    infoCard: {
        backgroundColor: primaryBackgroundColor,
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderRadius: 10,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: primaryColor,
        borderRightWidth: 4,
        borderRightColor: primaryColor,
    },

    employeeName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: primaryColor,
        marginBottom: 4,
    },

    employeeRole: {
        fontSize: 12,
        fontWeight: 'bold',
        color: secondaryColor,
        letterSpacing: 0.4,
    },
});

export default function WelcomeLetterTemplate({
    employeeName,
    position,
}) {
    const today = dayjs().format('DD MMMM YYYY');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* ===== Decorative Page Frame ===== */}
                <View style={styles.topBar} />
                <View style={styles.sideBarLeft} />
                <View style={styles.sideBarRight} />
                <View style={styles.bottomBar} />

                <View style={styles.content}>
                    {/* Logo */}
                    <View style={styles.header}>
                        <Image
                            src="/JupiNextName.png"
                            alt="Company Logo"
                            style={styles.logo}
                        />
                    </View>

                    {/* Title */}
                    <View style={styles.titleWrapper}>
                        <Text style={styles.title}>
                            THANK YOU & WELCOME
                        </Text>
                    </View>

                    {/* Employee Info */}
                    <View style={styles.infoCard}>
                        <Text style={styles.employeeName}>
                            {employeeName}
                        </Text>
                        <Text style={styles.employeeRole}>
                            {position}
                        </Text>
                    </View>

                    {/* Salutation */}
                    <Text style={{ ...styles.section, fontWeight: 600, fontSize: 12 }}>
                        My dear <Text style={styles.boldPrimary}>Business Partner</Text>,{' '}
                        <Text style={styles.boldPrimary}>{employeeName}</Text>,
                    </Text>

                    {/* Welcome */}
                    <Text style={styles.section}>
                        I am <Text style={styles.boldPrimary}>delighted</Text> to welcome you to{' '}
                        <Text style={{ fontWeight: 'bold', color: primaryColor }}>Jupi</Text>
                        <Text style={{ fontWeight: 'bold', color: secondaryColor }}>Next</Text>.
                        Your decision to join us <Text style={styles.boldPrimary}>means a great deal</Text>,
                        and I truly look forward to building something{' '}
                        <Text style={styles.boldPrimary}>meaningful</Text> together.
                    </Text>

                    {/* Leadership */}
                    <Text style={styles.section}>
                        Your <Text style={styles.boldPrimary}>leadership</Text> and{' '}
                        <Text style={styles.boldPrimary}>vision</Text> as{' '}
                        <Text style={styles.boldPrimary}>{position}</Text> will play a key role
                        in shaping our <Text style={styles.boldPrimary}>technology</Text> and{' '}
                        <Text style={styles.boldPrimary}>future growth</Text>.
                    </Text>

                    {/* Journey */}
                    <Text style={styles.section}>
                        We look forward to building this journey together through{' '}
                        <Text style={styles.boldPrimary}>collaboration</Text>,{' '}
                        <Text style={styles.boldPrimary}>innovation</Text>, and
                        <Text style={styles.boldPrimary}> shared purpose.</Text>
                    </Text>

                    {/* Appreciation */}
                    <Text style={{ ...styles.section, fontWeight: 600, fontSize: 12 }}>
                        Thank you for <Text style={styles.boldPrimary}>approving the business proposal</Text>{' '}
                        and for the <Text style={styles.boldPrimary}>trust</Text> you have shown in our journey.
                        I truly value your support.
                    </Text>

                    <View style={styles.divider} />

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={{ fontWeight: 600, color: secondaryColor }}>Warmest regards,</Text>
                        <View style={styles.signature}>
                            <Text
                                style={{
                                    ...styles.boldPrimary,
                                    marginTop: 24,
                                    fontSize: 14
                                }}
                            >
                                Dhaval Parekh :)
                            </Text>

                            <Image
                                src="/JupiNextName.png"
                                alt="JupiNext Logo"
                                style={{
                                    width: 150,
                                    height: 60,
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
