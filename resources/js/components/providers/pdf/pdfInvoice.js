import { PDFDocument } from "pdf-lib";
import download from "downloadjs";

const pdfInvoice = async (image) => {
	// Load a PDFDocument from the existing PDF bytes
	const pdfDoc = await PDFDocument.create();

	const pngInvoiceBytes = await fetch(image).then((res) => res.arrayBuffer());
	const pngInvoiceCertificate = await pdfDoc.embedPng(pngInvoiceBytes);
	const pngInvoiceCertificateDims = pngInvoiceCertificate.scale(1);

	const page = pdfDoc.addPage([595, 350]);

	page.drawImage(pngInvoiceCertificate, {
		x: 20,
		y: page.getHeight() / 2 - pngInvoiceCertificateDims.height / 2,
		width: pngInvoiceCertificateDims.width - 45,
		height: pngInvoiceCertificateDims.height,
	});

	// Serialize the PDFDocument to bytes (a Uint8Array)
	const pdfBytes = await pdfDoc.save();

	download(
		pdfBytes,
		`invoice-${new Date().getFullYear()}.pdf`,
		"application/pdf"
	);
};

export default pdfInvoice;
