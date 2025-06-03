import QrCodeComponent from "react-qr-code";

export default function QrCode({ value }: { value: string }) {
  return (
    <div className="flex w-auto justify-center rounded-sm border p-3">
      <div className="rounded-md bg-white p-3">
        <QrCodeComponent value={value} className="size-40" />
      </div>
    </div>
  );
}
