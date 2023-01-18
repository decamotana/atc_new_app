const getBase64Image = (img, callback) => {
	const reader = new FileReader();
	reader.addEventListener("load", () => callback(reader.result));
	reader.readAsDataURL(img);
};
export default getBase64Image;
