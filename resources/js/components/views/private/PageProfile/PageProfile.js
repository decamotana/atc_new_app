import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Button,
	Card,
	Checkbox,
	Col,
	Collapse,
	Divider,
	Form,
	message,
	notification,
	Radio,
	Row,
	Typography,
	Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import optionCountryCodes from "../../../providers/optionCountryCodes";
import optionStateCodesUnitedState from "../../../providers/optionStateCodesUnitedState";
import optionStateCodesCanada from "../../../providers/optionStateCodesCanada";
import obscureEmail from "../../../providers/obscureEmail";
import FloatInput from "../../../providers/FloatInput";
import FloatSelect from "../../../providers/FloatSelect";
import {
	apiUrl,
	encrypt,
	role,
	token,
	userData,
} from "../../../providers/companyInfo";
import { GET, POST, POSTFILE } from "../../../providers/useAxiosQuery";
import ModalDeactivateAcc from "./Components/ModalDeactivateAcc";
import ModaFormChangePassword from "./Components/ModaFormChangePassword";
import FloatInputMask from "../../../providers/FloatInputMask";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-regular-svg-icons";
import { useEffect } from "react";
import axios from "axios";
import ModaFormChangeEmail from "./Components/ModaFormChangeEmail";

export default function PageProfile() {
	const history = useHistory();
	const [form] = Form.useForm();

	const stateUS = optionStateCodesUnitedState();
	const stateCA = optionStateCodesCanada();

	const [optionState, setOptionState] = useState([]);
	const [stateLabel, setStateLabel] = useState("State");
	const [optionZip, setOptionZip] = useState();
	const [zipLabel, setZipLabel] = useState("Zip Code");

	const [fileList, setFileList] = useState([]);
	const [radioData, setRadioData] = useState(1);
	const [imageCrop, setImageCrop] = useState({
		width: 1,
		height: 1,
	});

	const [statusDeactivateAcc, setStatusDeactivateAcc] = useState(true);
	const [toggleModalDeactivateAcc, setToggleModalDeactivateAcc] = useState({
		title: "",
		show: false,
	});
	const [toggleModalFormChangePassword, setToggleModalFormChangePassword] =
		useState(false);
	const [toggleModalFormChangeEmail, setToggleModalFormChangeEmail] =
		useState(false);
	const [selectedData, setSelectedData] = useState();

	const { refetch: refetchUser } = GET(
		`api/v1/users/${userData().id}`,
		"update_profile_info",
		(res) => {
			if (res.success) {
				if (res.data) {
					let data = res.data;

					let selectedDataTemp = { ...data };
					if (role() !== "Cancer Caregiver" && data.company) {
						selectedDataTemp = {
							...data,
							company_name: data.company.company_name,
							address1: data.company.address1,
							address2: data.company.address2,
							state: data.company.state,
							city: data.company.city,
							zip: data.company.zip,
							business_phone: data.company.business_phone,
						};
					}
					setSelectedData(selectedDataTemp);
					// console.log("data", data);
					// console.log("mutateUpdateProfile userData", userData());
					if (parseInt(data.photo_crop) === 1) {
						setImageCrop({
							width: 1,
							height: 1,
						});
						setRadioData(1);
					} else if (parseInt(data.photo_crop) === 2) {
						setImageCrop({
							width: 3.9,
							height: 2.6,
						});
						setRadioData(2);
					} else if (parseInt(data.photo_crop) === 3) {
						setImageCrop({
							width: 1,
							height: 1.5,
						});
						setRadioData(3);
					} else {
						setImageCrop({
							width: 1,
							height: 1,
						});
						setRadioData(1);
					}

					form.setFieldsValue({
						username: data.username,
						firstname: data.firstname,
						lastname: data.lastname,
						email: data.email,
					});

					if (data.contact_number) {
						form.setFieldsValue({ contact_number: data.contact_number });
					}
					if (data.email_alternative) {
						form.setFieldsValue({ email_alternative: data.email_alternative });
					}
					if (data.usersRef) {
						form.setFieldsValue({ referred_by: data.usersRef });
					}

					if (role() !== "Cancer Caregiver") {
						if (data.company) {
							let company = data.company;

							form.setFieldsValue({
								country: company.country,
							});
							if (company.company_name) {
								form.setFieldsValue({ company_name: company.company_name });
							}
							if (company.address1) {
								form.setFieldsValue({ address1: company.address1 });
							}
							if (company.address2) {
								form.setFieldsValue({ address2: company.address2 });
							}
							if (company.state) {
								form.setFieldsValue({ state: company.state });
							}
							if (company.city) {
								form.setFieldsValue({ city: company.city });
							}
							if (company.zip) {
								form.setFieldsValue({ zip: company.zip });
							}
							if (company.business_phone) {
								form.setFieldsValue({ business_phone: company.business_phone });
							}

							if (company.country === "United States") {
								setOptionState(stateUS);
								setStateLabel("State");
								setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
								setZipLabel("Zip Code");
							} else if (company.country === "Canada") {
								setOptionState(stateCA);
								setStateLabel("County");
								setOptionZip(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/);
								setZipLabel("Postal Code");
							} else {
								setOptionState(stateUS);
								setStateLabel("State");
								setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
								setZipLabel("Zip Code");
							}
						}
					}

					if (data.profile_image) {
						let image_type = data.profile_image
							? data.profile_image.split("/")
							: "";

						// console.log("image_type", image_type);
						if (image_type[0] !== undefined) {
							image_type =
								image_type[0] === "https:"
									? data.profile_image
									: apiUrl + data.profile_image;

							setFileList([
								{
									uid: "-1",
									name: "image.png",
									status: "done",
									url: image_type,
								},
							]);
						} else {
							setFileList([]);
							image_type = "";
						}
					}
				}
			}
		}
	);

	const { mutate: mutateUpdateProfile } = POSTFILE(
		"api/v1/update_profile",
		"update_profile_opt"
	);

	const advertisementFilter = {
		advert_for: role(),
		status: "current",
		from: "profile",
	};

	GET(
		`api/v1/advertisement?${new URLSearchParams(advertisementFilter)}`,
		"advertisement_data_info",
		(res) => {
			if (res.success) {
				if (res.data) {
					let data = res.data;

					if (role() !== "Admin" || role() !== "Super Admin") {
						/** banner top */
						let adsTop = [];
						$(".top-banner-adss").removeClass("has-data hide").addClass("hide");
						$(".top-banner-adss .top-banner-adss-inner-image").empty();

						data
							.filter((itemFilter) => itemFilter.position === "Banner / Top")
							.map((item, index) => {
								if (item.position === "Banner / Top") {
									let url_link = "#!";
									if (item.url_link) {
										let url_link_temp = item.url_link.split("/");
										if (
											url_link_temp[0] === "https:" ||
											url_link_temp[0] === "http:"
										) {
											url_link = item.url_link;
										} else {
											url_link = item.url_type + item.url_link;
										}
										adsTop.push(
											`<img class="top-img-banner cursor-pointer top-img-banner-${index}" data-index="${index}" id="${item.id}" data-url="${url_link}" src="${apiUrl}storage/${item.file_path}"  />`
										);
									}
								}
								return "";
							});

						if (adsTop.length > 0) {
							$(".top-banner-adss").addClass("has-data").removeClass("hide");
							$(".top-banner-adss .top-banner-adss-inner-image").append(adsTop);
							$(".top-banner-adss-inner-image img").css("display", "none");

							$(`.top-banner-adss-inner-image img.top-img-banner-0`).css(
								"display",
								"block"
							);

							let topCurrentSlide = 0;
							setInterval(() => {
								if (topCurrentSlide === adsTop.length - 1) {
									topCurrentSlide = 0;
								} else {
									topCurrentSlide++;
								}

								$(`.top-banner-adss-inner-image img`).css("display", "none");
								$(
									`.top-banner-adss-inner-image img.top-img-banner-${topCurrentSlide}`
								).css("display", "block");
							}, 10000);
						}
						/** end banner top */

						/** banner right */
						let adsRight = [];
						$(".right-banner-adss").removeClass("has-data").addClass("hide");
						$(".right-banner-adss .right-banner-adss-inner-image").empty();

						data
							.filter((itemFilter) => itemFilter.position === "Banner / Right")
							.map((item, index) => {
								if (item.position === "Banner / Right") {
									let url_link = "#!";
									if (item.url_link) {
										let url_link_temp = item.url_link.split("/");
										if (
											url_link_temp[0] === "https:" ||
											url_link_temp[0] === "http:"
										) {
											url_link = item.url_link;
										} else {
											url_link = item.url_type + item.url_link;
										}
										adsRight.push(
											`<img class="right-img-banner cursor-pointer right-img-banner-${index}" data-index="${index}" id="${item.id}" data-url="${url_link}" src="${apiUrl}storage/${item.file_path}" />`
										);
									}
								}
								return "";
							});

						if (adsRight.length > 0) {
							$(".right-banner-adss").addClass("has-data").removeClass("hide");
							$(".right-banner-adss .right-banner-adss-inner-image").append(
								adsRight
							);
							$(".right-banner-adss-inner-image img").css("display", "none");

							$(`.right-banner-adss-inner-image img.right-img-banner-0`).css(
								"display",
								"block"
							);

							let rightCurrentSlide = 0;
							setInterval(() => {
								if (rightCurrentSlide === adsRight.length - 1) {
									rightCurrentSlide = 0;
								} else {
									rightCurrentSlide++;
								}

								$(`.right-banner-adss-inner-image img`).css("display", "none");
								$(
									`.right-banner-adss-inner-image img.right-img-banner-${rightCurrentSlide}`
								).css("display", "block");
							}, 10000);
						}
						/** end banner right */
					}
				}
			}
		}
	);

	// const {
	// 	mutate: mutateAdvertisementClick,
	// 	// isLoading: isLoadingCreateSubscriber,
	// } = POST("api/v1/aaa_click", `aaa_click_`);

	const handleCountry = (e, opt) => {
		if (e === "United States") {
			setOptionState(stateUS);
			setStateLabel("State");
			setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
			setZipLabel("Zip Code");
		} else if (e === "Canada") {
			setOptionState(stateCA);
			setStateLabel("County");
			setOptionZip(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/);
			setZipLabel("Postal Code");
		} else {
			setOptionState(stateUS);
			setStateLabel("State");
			setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
			setZipLabel("Zip Code");
		}

		form.resetFields(["state", "zip"]);
	};

	const handleResize = (val) => {
		setRadioData(val.target.value);
		if (val.target.value === 1) {
			setImageCrop({
				width: 1,
				height: 1,
			});
		} else if (val.target.value === 2) {
			setImageCrop({
				width: 3.9,
				height: 2.6,
			});
		} else if (val.target.value === 3) {
			setImageCrop({
				width: 1,
				height: 1.5,
			});
		}
	};

	const onChangeUpload = ({ fileList: newFileList }) => {
		var _file = newFileList;
		if (_file.length !== 0) {
			const isLt2M = _file[0].size / 1024 ** 2 > 2;
			if (isLt2M) {
				setFileList([]);
			} else {
				_file[0].status = "done";
				setFileList(_file);
				setTimeout(() => form.submit(), 500);
			}
		} else {
			setFileList([]);
		}
	};

	const onPreviewUpload = async (file) => {
		let src = file.url;
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);
				reader.onload = () => resolve(reader.result);
			});
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow?.document.write(image.outerHTML);
	};

	const beforeUpload = (file) => {
		const isJpgOrPng =
			file.type === "image/jpeg" ||
			file.type === "image/png" ||
			file.type === "image/gif" ||
			file.type === "image/jpg";
		if (!isJpgOrPng) {
			message.error("You can only upload JPG, PNG, GIF, JPEG file!");
			setFileList([]);
			return;
		}
		// const isLt2M = file.size / 1024 ** 2 > 2;
		// if (isLt2M) {
		// 	message.error("Image must smaller than 2MB!");
		// 	setFileList([]);
		// 	return;
		// }

		return isJpgOrPng;
		// return isJpgOrPng && isLt2M;
	};

	const beforeCrop = (file) => {
		const isLt2M = file.size / 1024 ** 2 > 2;
		if (isLt2M) {
			message.error("Image must smaller than 2MB!");
			setFileList([]);
			return false;
		} else {
			return true;
		}
	};

	const onFinish = (values) => {
		// console.log("onFinish", values);
		let dataForm = new FormData();

		let error = false;

		dataForm.append("id", userData().id);
		dataForm.append("firstname", values.firstname);
		dataForm.append("lastname", values.lastname);

		if (values.contact_number !== "" && values.contact_number !== undefined) {
			let newval = values.contact_number.split("_").join("");
			newval = newval.split(" ").join("");

			if (newval.length === 10) {
				dataForm.append("contact_number", newval);
			} else {
				error = true;
				notification.error({
					message: "Profile Info",
					description: "Contact Number should 10 digits",
				});
			}
		}

		dataForm.append(
			"email_alternative",
			values.email_alternative ? values.email_alternative : ""
		);
		dataForm.append("role", role());
		if (role() !== "Cancer Caregiver") {
			dataForm.append(
				"company_name",
				values.company_name ? values.company_name : ""
			);
			dataForm.append("address1", values.address1 ? values.address1 : "");
			dataForm.append("address2", values.address2 ? values.address2 : "");
			dataForm.append("country", values.country ? values.country : "");
			dataForm.append("state", values.state ? values.state : "");
			dataForm.append("city", values.city ? values.city : "");
			dataForm.append("zip", values.zip ? values.zip : "");

			if (values.business_phone !== "" && values.business_phone !== undefined) {
				let newval = values.business_phone.split("_").join("");
				newval = newval.split(" ").join("");

				if (newval.length === 10) {
					dataForm.append("business_phone", newval);
				} else {
					error = true;
					notification.error({
						message: "Profile Info",
						description: "Business phone should 10 digits",
					});
				}
			}
		}
		// console.log("fileList", fileList);
		if (fileList.length > 0) {
			if (fileList[0].originFileObj !== undefined) {
				dataForm.append(
					"profile_image",
					fileList[0].originFileObj,
					fileList[0].name
				);
				dataForm.append("photo_crop", radioData);
			}
		}

		if (error === false) {
			mutateUpdateProfile(dataForm, {
				onSuccess: (res) => {
					if (res.success) {
						notification.success({
							message: "Profile Info",
							description: res.message,
						});

						let data = res.data;

						localStorage.userdata = encrypt(data);

						// console.log("mutateUpdateProfile data", data);

						// console.log("mutateUpdateProfile userData", userData());

						if (data.profile_image) {
							let image_type = data.profile_image.split("/");

							if (image_type[0] === "https:") {
								$(".ant-menu-submenu-profile").attr({
									src: data.profile_image,
									width: parseInt(data.photo_crop) === 2 ? "85px" : "70px",
								});
								$(".ant-menu-item-profile .ant-image-img").attr(
									"src",
									data.profile_image
								);
							} else {
								$(".ant-menu-submenu-profile").attr({
									src: apiUrl + data.profile_image,
									width: parseInt(data.photo_crop) === 2 ? "85px" : "70px",
								});

								$(".ant-menu-item-profile .ant-image-img").attr(
									"src",
									apiUrl + data.profile_image
								);
							}
						}

						$(".ant-typography-profile-details-name-info").html(
							res.data.firstname + " " + res.data.lastname
						);
					} else {
						notification.error({
							message: "Profile Info",
							description: res.message,
						});
					}
				},
				onError: (err) => {
					notification.error({
						message: "Profile Info",
						description: err.response.data.message,
					});
				},
			});
		}
	};

	const handleCheckboxDeactivateAccount = (e) => {
		setStatusDeactivateAcc(e.target.checked === true ? false : true);
	};

	const handleClickDeactivateAcc = () => {
		let title = `${role()} - $${
			selectedData &&
			selectedData.account_type &&
			selectedData.account_type.account_plan.length > 0
				? parseFloat(selectedData.account_type.account_plan[0].amount).toFixed(
						2
				  )
				: "0.00"
		}`;
		setToggleModalDeactivateAcc({ title, show: true });
	};

	const handleInputBlur = (value, field) => {
		// console.log("value, field", value, field, selectedData[field], value);
		if (field === "contact_number" || field === "business_phone") {
			if (value !== undefined) {
				let newval = value.split("_").join("");
				newval = newval.split(" ").join("");
				// console.log("newval", newval);
				if (selectedData[field] !== newval) {
					form.submit();
				}
			}
		} else {
			if (selectedData[field] !== value) {
				form.submit();
			}
		}
	};

	const { mutate: mutateEmailCode, isLoading: isLoadingEmailCode } = POST(
		"api/v1/profile_verify_code",
		"profile_verify_code"
	);

	const [changeEmail, setChangeEmail] = useState("");

	const onFinishFormEmailCode = (values) => {
		let data = {
			...values,
			email: changeEmail,
			id: userData().id,
			link_origin: window.location.origin,
		};

		mutateEmailCode(data, {
			onSuccess: (res) => {
				if (res.success) {
					// console.log(res)
					notification.success({
						message: "Change Email",
						description: res.message,
					});
					let data = res.data;

					localStorage.userdata = encrypt(data);

					refetchUser();
					setToggleModalFormChangeEmail(false);
				} else {
					notification.error({
						message: "Change Email",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Change Email",
					description: err.response.data.message,
				});
			},
		});
	};

	useEffect(() => {
		let top_banner_ads_interval = setInterval(function () {
			let top_banner_ads = $(
				".top-banner-adss .top-banner-adss-inner .top-img-banner"
			);
			// console.log("top_banner_ads", top_banner_ads);
			if (top_banner_ads.length > 0) {
				// console.log("top_banner_ads.length", top_banner_ads.length);
				$(".top-banner-adss .top-banner-adss-inner .top-img-banner").on(
					"click",
					function (e) {
						e.preventDefault();

						let id = $(this).attr("id");
						let data_url = $(this).attr("data-url");
						window.open(data_url, "_blank");
						axios
							.post(
								`${apiUrl}api/v1/aaa_click`,
								{ id },
								{
									headers: {
										Authorization: token(),
									},
								}
							)
							.then((res) => {
								// console.log("res", res);
							});
					}
				);
				clearInterval(top_banner_ads_interval);
			}
		}, 1000);
		let right_banner_ads_interval = setInterval(function () {
			let right_banner_ads = $(
				".right-banner-adss .right-banner-adss-inner .right-img-banner"
			);
			// console.log("right_banner_ads", right_banner_ads);
			if (right_banner_ads.length > 0) {
				// console.log("right_banner_ads.length", right_banner_ads.length);
				$(".right-banner-adss .right-banner-adss-inner .right-img-banner").on(
					"click",
					function (e) {
						e.preventDefault();

						let id = $(this).attr("id");
						let data_url = $(this).attr("data-url");
						window.open(data_url, "_blank");
						axios
							.post(
								`${apiUrl}api/v1/aaa_click`,
								{ id },
								{
									headers: {
										Authorization: token(),
									},
								}
							)
							.then((res) => {
								// console.log("res", res);
							});
					}
				);
				clearInterval(right_banner_ads_interval);
			}
		}, 1000);

		return () => {};
	}, []);

	return (
		<Card className="page-profile" id="PageProfile">
			<Form form={form} onFinish={onFinish}>
				<Row gutter={[12, 12]}>
					<Col xs={24} sm={24} md={24} lg={24} xl={16}>
						<Collapse
							className="main-1-collapse border-none"
							expandIcon={({ isActive }) =>
								isActive ? (
									<span
										className="ant-menu-submenu-arrow"
										style={{ color: "#FFF", transform: "rotate(270deg)" }}
									></span>
								) : (
									<span
										className="ant-menu-submenu-arrow"
										style={{ color: "#FFF", transform: "rotate(90deg)" }}
									></span>
								)
							}
							defaultActiveKey={["1"]}
							expandIconPosition="start"
						>
							<Collapse.Panel
								header="LOGIN INFORMATION"
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row gutter={8}>
									<Col xs={24} sm={24} md={24}>
										<Form.Item name="username">
											<FloatInput
												label="Username"
												placeholder="Username"
												disabled={true}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24}>
										<Button
											type="link"
											className="color-6 m-l-n"
											onClick={() => setToggleModalFormChangePassword(true)}
										>
											Change Password
										</Button>
									</Col>
									<Col xs={24} sm={24} md={24} className="m-t-xs">
										<div className="flex flex-align-items-center gap10">
											<Button
												type="link"
												className="color-6 m-l-n"
												onClick={() => setToggleModalFormChangeEmail(true)}
											>
												Change Email
											</Button>

											<Form.Item
												className="m-b-none"
												shouldUpdate={(prevValues, curValues) =>
													prevValues.users !== curValues.users
												}
											>
												{({ getFieldValue }) => {
													const email = getFieldValue("email") || "";
													return (
														<span>{email ? obscureEmail(email) : ""}</span>
													);
												}}
											</Form.Item>
										</div>
									</Col>
									{role() !== "Admin" && role() !== "Super Admin" ? (
										<Col xs={24} sm={24} md={24}>
											<Button
												type="link"
												onClick={() => history.push("/profile/2fa")}
											>
												<span className="color-8 m-r-xs m-l-n">Set-up</span>{" "}
												<span className="color-6">
													2-Factor Authentication (2FA)
												</span>
											</Button>
										</Col>
									) : null}
								</Row>
							</Collapse.Panel>
						</Collapse>

						<Collapse
							className="main-1-collapse border-none"
							expandIcon={({ isActive }) =>
								isActive ? (
									<span
										className="ant-menu-submenu-arrow"
										style={{ color: "#FFF", transform: "rotate(270deg)" }}
									></span>
								) : (
									<span
										className="ant-menu-submenu-arrow"
										style={{ color: "#FFF", transform: "rotate(90deg)" }}
									></span>
								)
							}
							defaultActiveKey={["1"]}
							expandIconPosition="start"
						>
							<Collapse.Panel
								header="PERSONAL INFORMATION"
								key="1"
								className="accordion bg-darkgray-form m-b-md border "
							>
								<Row gutter={12}>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="firstname">
											<FloatInput
												label="First Name"
												placeholder="First Name"
												onBlurInput={(e) => handleInputBlur(e, "firstname")}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="lastname">
											<FloatInput
												label="Last Name"
												placeholder="Last Name"
												onBlurInput={(e) => handleInputBlur(e, "lastname")}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="contact_number">
											<FloatInputMask
												label="Cell Phone"
												placeholder="Cell Phone"
												maskLabel="contact_number"
												maskType="999 999 9999"
												onBlurInput={(e) =>
													handleInputBlur(e, "contact_number")
												}
											/>
										</Form.Item>
									</Col>
									{role() === "Admin" || role() === "Super Admin" ? (
										<Col xs={24} sm={24} md={24} className="m-b-md">
											<Button
												type="link"
												onClick={() => history.push("/profile/2fa")}
												className="btn-2fa"
											>
												<span className="color-6 m-r-xs m-l-n">CLICK HERE</span>{" "}
												<span className="color-7">
													to enable 2-Factor Authetication (2FA)
												</span>
											</Button>
										</Col>
									) : null}
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="email_alternative">
											<FloatInput
												label="Email Address (Alternative)"
												placeholder="Email Address (Alternative)"
												onBlurInput={(e) =>
													handleInputBlur(e, "email_alternative")
												}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="referred_by">
											<FloatInput
												label="Referred by"
												placeholder="Referred by"
												disabled={true}
											/>
										</Form.Item>
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>

						{role() !== "Cancer Caregiver" ? (
							<Collapse
								className="main-1-collapse border-none"
								expandIcon={({ isActive }) =>
									isActive ? (
										<span
											className="ant-menu-submenu-arrow"
											style={{ color: "#FFF", transform: "rotate(270deg)" }}
										></span>
									) : (
										<span
											className="ant-menu-submenu-arrow"
											style={{ color: "#FFF", transform: "rotate(90deg)" }}
										></span>
									)
								}
								defaultActiveKey={["1"]}
								expandIconPosition="start"
							>
								<Collapse.Panel
									header="COMPANY INFORMATION"
									key="1"
									className="accordion bg-darkgray-form m-b-md border "
								>
									<Row gutter={8}>
										<Col xs={24} sm={24} md={24}>
											<Form.Item name="company_name">
												<FloatInput
													label="Name"
													placeholder="Name"
													onBlurInput={(e) =>
														handleInputBlur(e, "company_name")
													}
												/>
											</Form.Item>
										</Col>
										<Col xs={24} sm={24} md={12}>
											<Form.Item name="country" className="form-select-error">
												<FloatSelect
													label="Country"
													placeholder="Country"
													options={optionCountryCodes}
													onChange={handleCountry}
													onBlurInput={(e) => handleInputBlur(e, "country")}
												/>
											</Form.Item>
										</Col>
										<Col xs={24} sm={24} md={12}>
											<Form.Item name="state" className="form-select-error">
												<FloatSelect
													label={stateLabel}
													placeholder={stateLabel}
													options={optionState}
													onBlurInput={(e) => handleInputBlur(e, "city")}
												/>
											</Form.Item>
										</Col>
										<Col xs={24} sm={24} md={12}>
											<Form.Item name="address1">
												<FloatInput
													label="Address 1"
													placeholder="Address 1"
													onBlurInput={(e) => handleInputBlur(e, "address1")}
												/>
											</Form.Item>
										</Col>
										<Col xs={24} sm={24} md={12}>
											<Form.Item name="address2">
												<FloatInput
													label="Address 2"
													placeholder="Address 2"
													onBlurInput={(e) => handleInputBlur(e, "address2")}
												/>
											</Form.Item>
										</Col>
										<Col xs={24} sm={24} md={8}>
											<Form.Item name="city">
												<FloatInput
													label="City"
													placeholder="City"
													onBlurInput={(e) => handleInputBlur(e, "city")}
												/>
											</Form.Item>
										</Col>
										<Col xs={24} sm={24} md={8}>
											<Form.Item
												name="zip"
												className="w-100"
												rules={[
													{
														required: true,
														message: "This field is required.",
													},
													{
														pattern: optionZip,
														message: "Invalid Zip",
													},
												]}
											>
												<FloatInput
													label={zipLabel}
													placeholder={zipLabel}
													onBlurInput={(e) => handleInputBlur(e, "zip")}
												/>
											</Form.Item>
										</Col>
										<Col xs={24} sm={24} md={8}>
											<Form.Item name="business_phone">
												<FloatInputMask
													label="Phone"
													placeholder="Phone"
													maskLabel="business_phone"
													maskType="999 999 9999"
													onBlurInput={(e) =>
														handleInputBlur(e, "business_phone")
													}
												/>
											</Form.Item>
										</Col>
									</Row>
								</Collapse.Panel>
							</Collapse>
						) : null}
					</Col>

					<Col xs={24} sm={24} md={24} lg={24} xl={8}>
						<Collapse
							className="main-1-collapse border-none"
							expandIcon={({ isActive }) =>
								isActive ? (
									<span
										className="ant-menu-submenu-arrow"
										style={{ color: "#FFF", transform: "rotate(270deg)" }}
									></span>
								) : (
									<span
										className="ant-menu-submenu-arrow"
										style={{ color: "#FFF", transform: "rotate(90deg)" }}
									></span>
								)
							}
							defaultActiveKey={["1"]}
							expandIconPosition="start"
						>
							<Collapse.Panel
								header="PROFILE PHOTO"
								key="1"
								className="accordion bg-darkgray-form m-b-md border "
							>
								<Row gutter={12}>
									<Col xs={24} sm={24} md={24}>
										<label className="font-red">
											<b>Please select photo orientation</b>
										</label>
										<br />
										<Radio.Group onChange={handleResize} value={radioData}>
											<Radio value={1}>Square</Radio>
											<Radio value={2}>Rectangle</Radio>
											<Radio value={3}>Portrait</Radio>
										</Radio.Group>
									</Col>
									<Divider />
									<Col xs={24} sm={24} md={24}>
										<div className="flex">
											<ImgCrop
												rotate
												aspect={imageCrop.width / imageCrop.height}
												modalTitle="Crop Image"
												beforeCrop={beforeCrop}
											>
												<Upload
													listType="picture-card"
													maxCount={1}
													action={false}
													customRequest={false}
													fileList={fileList}
													onChange={onChangeUpload}
													onPreview={onPreviewUpload}
													beforeUpload={beforeUpload}
													className="profilePhoto"
												>
													{fileList.length < 1 && "+ Upload"}
												</Upload>
											</ImgCrop>
										</div>
									</Col>
									<Divider />
									<Col xs={24} sm={24} md={24}>
										<Typography.Text>
											Only 1 file. 2 MB limit.
											<br />
											Allowed types: png, gif, jpg, jpeg
											<br />
											You selected profile photo will be visible to all users.
										</Typography.Text>
										{/* <br />
										<Typography.Text className="color-secondary">
											Allowed types png, gif, jpeg.
										</Typography.Text> */}
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>

						{role() !== "Admin" && role() !== "Super Admin" ? (
							<>
								<Collapse
									className="main-1-collapse border-none"
									expandIcon={({ isActive }) =>
										isActive ? (
											<span
												className="ant-menu-submenu-arrow"
												style={{ color: "#FFF", transform: "rotate(270deg)" }}
											></span>
										) : (
											<span
												className="ant-menu-submenu-arrow"
												style={{ color: "#FFF", transform: "rotate(90deg)" }}
											></span>
										)
									}
									defaultActiveKey={["1"]}
									expandIconPosition="start"
								>
									<Collapse.Panel
										header="SUBSCRIPTION"
										key="1"
										className="accordion bg-darkgray-form m-b-md border"
									>
										<Row gutter={[12, 20]}>
											<Col xs={24} sm={24} md={24}>
												<Typography.Title level={3} className="color-1">
													{role()} - $
													{selectedData &&
													selectedData.account_type &&
													selectedData.account_type.account_plan.length > 0
														? parseFloat(
																selectedData.account_type.account_plan[0].amount
														  ).toFixed(2)
														: "0.00"}
												</Typography.Title>
												<Typography.Text>
													You are set up for manual payments, you are not on a
													recurring payment plan.
												</Typography.Text>
											</Col>
											<Col xs={24} sm={24} md={24}>
												<Button
													className="btn-main-invert b-r-none w-100"
													size="large"
													onClick={() =>
														history.push("/profile/account/subscription")
													}
												>
													VIEW SUBSCRIPTION
												</Button>
											</Col>
										</Row>
									</Collapse.Panel>
								</Collapse>
								<Collapse
									className="main-1-collapse border-none"
									expandIcon={({ isActive }) =>
										isActive ? (
											<span
												className="ant-menu-submenu-arrow"
												style={{ color: "#FFF", transform: "rotate(270deg)" }}
											></span>
										) : (
											<span
												className="ant-menu-submenu-arrow"
												style={{ color: "#FFF", transform: "rotate(90deg)" }}
											></span>
										)
									}
									defaultActiveKey={["1"]}
									expandIconPosition="start"
								>
									<Collapse.Panel
										header="DEACTIVATE ACCOUNT"
										key="1"
										className="accordion bg-darkgray-form m-b-md border"
									>
										<Row gutter={[12, 20]}>
											<Col xs={24} sm={24} md={24}>
												<Typography.Text>
													No longer need your account and want to deactivate it?
												</Typography.Text>
											</Col>
											<Col xs={24} sm={24} md={24}>
												<div className="flex gap10">
													<div>
														<Checkbox
															onChange={handleCheckboxDeactivateAccount}
														/>
													</div>
													<div>
														<Typography.Text>
															Yes I understand that by deactivating my account I
															will no longer have access to my account
															information and all historical data.
														</Typography.Text>
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={24}>
												<Button
													// className="btn-main-invert-outline-active b-r-none w-100"
													className="btn-main-invert-outline-active b-r-none w-100"
													size="large"
													disabled={statusDeactivateAcc}
													onClick={handleClickDeactivateAcc}
												>
													DEACTIVATE MY ACCOUNT
												</Button>
											</Col>
										</Row>
									</Collapse.Panel>
								</Collapse>
							</>
						) : null}

						<div className="right-banner-adss">
							<div className="right-banner-adss-inner">
								<div
									className="icon-close"
									onClick={() => $(".right-banner-adss").hide()}
								>
									<FontAwesomeIcon icon={faTimes} />
								</div>
								<div className="right-banner-adss-inner-image" />
							</div>
						</div>
					</Col>
				</Row>
			</Form>

			<ModalDeactivateAcc
				toggleModalDeactivateAcc={toggleModalDeactivateAcc}
				setToggleModalDeactivateAcc={setToggleModalDeactivateAcc}
			/>

			<ModaFormChangePassword
				toggleModalFormChangePassword={toggleModalFormChangePassword}
				setToggleModalFormChangePassword={setToggleModalFormChangePassword}
			/>

			<ModaFormChangeEmail
				toggleModalFormChangeEmail={toggleModalFormChangeEmail}
				setToggleModalFormChangeEmail={setToggleModalFormChangeEmail}
				onFinishFormEmailCode={onFinishFormEmailCode}
				isLoadingEmailCode={isLoadingEmailCode}
				changeEmail={changeEmail}
				setChangeEmail={setChangeEmail}
			/>
		</Card>
	);
}
