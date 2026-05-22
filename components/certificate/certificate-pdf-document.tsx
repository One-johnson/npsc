import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Line,
} from "@react-pdf/renderer";

export type CertificatePdfData = {
  attendeeName: string;
  organization?: string;
  position?: string;
  passName: string;
  certificateNumber: string;
  eventTitleLine2: string;
  edition: string;
  date: string;
  venue: string;
  city: string;
  issuedAtLabel: string;
};

const GREEN = "#14532d";
const GREEN_LIGHT = "#1a6b4f";
const GOLD = "#b8860b";
const GOLD_LIGHT = "#d4af37";
const RED = "#b91c1c";
const CREAM = "#fffdf7";
const INK = "#1c1917";
const MUTED = "#57534e";

const styles = StyleSheet.create({
  page: {
    backgroundColor: CREAM,
    fontFamily: "Helvetica",
  },
  frameOuter: {
    margin: 18,
    flex: 1,
    borderWidth: 2,
    borderColor: GOLD,
    padding: 6,
  },
  frameInner: {
    flex: 1,
    borderWidth: 3,
    borderColor: GREEN,
    padding: 28,
  },
  topBar: {
    height: 6,
    backgroundColor: RED,
    marginBottom: 20,
    marginHorizontal: -28,
    marginTop: -28,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  gips: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: MUTED,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  npsc: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: GREEN_LIGHT,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: GREEN,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  titleSub: {
    fontSize: 12,
    color: INK,
    marginBottom: 2,
  },
  edition: {
    fontSize: 10,
    color: MUTED,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
    gap: 12,
  },
  dividerLine: {
    width: 80,
    height: 1,
    backgroundColor: GOLD_LIGHT,
  },
  dividerDiamond: {
    width: 8,
    height: 8,
    backgroundColor: GOLD,
    transform: "rotate(45deg)",
  },
  body: {
    alignItems: "center",
    paddingHorizontal: 40,
    flex: 1,
  },
  certify: {
    fontSize: 12,
    color: MUTED,
    fontStyle: "italic",
    marginBottom: 14,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: GREEN,
    textAlign: "center",
    marginBottom: 6,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: GOLD_LIGHT,
    minWidth: 280,
  },
  org: {
    fontSize: 12,
    color: INK,
    marginBottom: 3,
  },
  role: {
    fontSize: 11,
    color: MUTED,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.65,
    color: INK,
    textAlign: "center",
    maxWidth: 520,
  },
  passBadge: {
    marginTop: 14,
    paddingVertical: 4,
    paddingHorizontal: 14,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: GREEN_LIGHT,
  },
  passText: {
    fontSize: 9,
    color: GREEN,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e7e5e4",
  },
  footerBlock: {
    maxWidth: 160,
  },
  footerLabel: {
    fontSize: 8,
    color: MUTED,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  footerValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: INK,
  },
  footerMono: {
    fontSize: 9,
    fontFamily: "Courier",
    color: GREEN,
  },
  sigLine: {
    width: 140,
    borderTopWidth: 1,
    borderTopColor: INK,
    marginBottom: 4,
    marginTop: 28,
  },
  sigLabel: {
    fontSize: 8,
    color: MUTED,
  },
  sealWrap: {
    position: "absolute",
    bottom: 100,
    right: 48,
    alignItems: "center",
  },
});

function CornerOrnament({ flip }: { flip?: boolean }) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      style={
        flip
          ? { position: "absolute", bottom: 12, right: 12 }
          : { position: "absolute", top: 12, left: 12 }
      }
    >
      <Path
        d="M2 2 L2 10 L10 10 L10 2 Z"
        fill={GOLD_LIGHT}
        opacity={0.35}
      />
      <Line x1={2} y1={2} x2={14} y2={2} stroke={GOLD} strokeWidth={1} />
      <Line x1={2} y1={2} x2={2} y2={14} stroke={GOLD} strokeWidth={1} />
    </Svg>
  );
}

export function CertificatePdfDocument({ data }: { data: CertificatePdfData }) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.frameOuter}>
          <View style={styles.frameInner}>
            <View style={styles.topBar} />
            <CornerOrnament />
            <CornerOrnament flip />

            <View style={styles.header}>
              <Text style={styles.gips}>
                Ghana Institute of Procurement and Supply
              </Text>
              <Text style={styles.npsc}>
                National Procurement & Supply Conference
              </Text>
              <Text style={styles.title}>Certificate of Attendance</Text>
              <Text style={styles.titleSub}>{data.eventTitleLine2}</Text>
              <Text style={styles.edition}>{data.edition} Edition</Text>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerDiamond} />
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.body}>
              <Text style={styles.certify}>This is to certify that</Text>
              <Text style={styles.name}>{data.attendeeName}</Text>
              {data.organization ? (
                <Text style={styles.org}>{data.organization}</Text>
              ) : null}
              {data.position ? (
                <Text style={styles.role}>{data.position}</Text>
              ) : null}
              <Text style={styles.paragraph}>
                attended the {data.edition} edition of the National Procurement
                & Supply Conference as a {data.passName}, held at {data.venue},{" "}
                {data.city}, on {data.date}, and has successfully participated
                in the conference proceedings.
              </Text>
              <View style={styles.passBadge}>
                <Text style={styles.passText}>Delegate pass · {data.passName}</Text>
              </View>
            </View>

            <View style={styles.sealWrap}>
              <View
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                  borderWidth: 2,
                  borderColor: GREEN,
                  backgroundColor: "#ecfdf5",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 27,
                    borderWidth: 1,
                    borderColor: GOLD,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "bold",
                      color: GREEN,
                      letterSpacing: 1,
                    }}
                  >
                    NPSC
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <View style={styles.footerBlock}>
                <Text style={styles.footerLabel}>Certificate number</Text>
                <Text style={styles.footerMono}>{data.certificateNumber}</Text>
                <Text style={styles.footerLabel}>Date of issue</Text>
                <Text style={styles.footerValue}>{data.issuedAtLabel}</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <View style={styles.sigLine} />
                <Text style={styles.sigLabel}>Authorised signatory</Text>
                <Text style={[styles.sigLabel, { marginTop: 2 }]}>
                  GIPS · NPSC Secretariat
                </Text>
              </View>
              <View style={[styles.footerBlock, { alignItems: "flex-end" }]}>
                <Text style={styles.footerLabel}>Conference</Text>
                <Text style={styles.footerValue}>{data.date}</Text>
                <Text style={[styles.footerLabel, { marginTop: 6 }]}>
                  Venue
                </Text>
                <Text style={styles.footerValue}>
                  {data.venue}, {data.city}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
