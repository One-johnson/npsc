"use client";

import dynamic from "next/dynamic";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CertificatePdfDocument,
  type CertificatePdfData,
} from "@/components/certificate/certificate-pdf-document";
import { cn } from "@/lib/utils";

const PdfLink = dynamic(
  () => Promise.resolve(PDFDownloadLink),
  { ssr: false }
);

type Props = {
  data: CertificatePdfData;
  fileName?: string;
  className?: string;
  variant?: "button" | "menu";
};

export function CertificatePdfDownload({
  data,
  fileName,
  className,
  variant = "button",
}: Props) {
  const safeName = data.attendeeName.replace(/[^\w\s-]/g, "").trim();
  const downloadName =
    fileName ?? `NPSC-Certificate-${safeName || "attendee"}.pdf`;

  if (variant === "menu") {
    return (
      <PdfLink
        document={<CertificatePdfDocument data={data} />}
        fileName={downloadName}
      >
        {({ loading }) => (
          <span
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 px-2 py-1.5 text-sm",
              loading && "opacity-60",
              className
            )}
          >
            <Download className="size-4" />
            {loading ? "Preparing PDF…" : "Download certificate PDF"}
          </span>
        )}
      </PdfLink>
    );
  }

  return (
    <PdfLink
      document={<CertificatePdfDocument data={data} />}
      fileName={downloadName}
    >
      {({ loading }) => (
        <Button
          type="button"
          variant="default"
          className={className}
          disabled={loading}
        >
          <Download className="size-4" />
          {loading ? "Preparing PDF…" : "Download certificate"}
        </Button>
      )}
    </PdfLink>
  );
}
