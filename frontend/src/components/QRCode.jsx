import QRCode from "qrcode.react";

export default function QRCodeComponent({ value }) {
    return (
        <div className="mt-4">
            <QRCode value={value} size={150} />
        </div>
    );
}
