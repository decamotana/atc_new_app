const obscureEmail = (email) => {
	const [name, domain] = email.split("@");
	return `${name[0]}${new Array(name.length).join("*")}@${domain}`;
};
export default obscureEmail;
