import { PDFDocument } from "pdf-lib";
import download from "downloadjs";

const pdfCertificateOfCompletion = async (props) => {
	const { imagePath } = props;

	// Load a PDFDocument from the existing PDF bytes
	const pdfDoc = await PDFDocument.create();

	const pngImageCertificateBytes = await fetch(imagePath).then((res) =>
		res.arrayBuffer()
	);

	const pngImageCertificate = await pdfDoc.embedPng(pngImageCertificateBytes);
	const pngImageCertificateDims = pngImageCertificate.scale(1);

	const page = pdfDoc.addPage([590, 380]);

	page.drawImage(pngImageCertificate, {
		x: page.getWidth() / 2 - pngImageCertificateDims.width / 3.5,
		y: page.getHeight() / 2 - pngImageCertificateDims.height / 4,
		width: pngImageCertificateDims.width / 2 + page.getWidth() / 8.3,
		height: pngImageCertificateDims.height / 2,
	});

	// Serialize the PDFDocument to bytes (a Uint8Array)
	const pdfBytes = await pdfDoc.save();
	download(
		pdfBytes,
		`certificate-of-completion-${new Date().getFullYear()}.pdf`,
		"application/pdf"
	);
};

export default pdfCertificateOfCompletion;
