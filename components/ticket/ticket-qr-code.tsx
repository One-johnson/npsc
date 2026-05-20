"use client";

import { QRCodeSVG } from "qrcode.react";

type Props = {
  value: string;
  size?: number;
  className?: string;
};

export function TicketQrCode({ value, size = 200, className }: Props) {
  return <QRCodeSVG value={value} size={size} level="M" className={className} />;
}
