const validateRules = {
  required: {
    required: true,
    message: "This field is required",
  },
  email: {
    type: "email",
    message: "Invalid email address",
  },
  email_validate: ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("email") === value) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error("The two emails that you entered do not match!")
      );
    },
  }),
  phone: {
    pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    message: "Invalid Phone Number",
  },
  cell: {
    pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    message: "Invalid Cell Number",
  },
  password: {
    pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,64}$/,
    message: "Invalid Password",
  },
  password_validate: ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("new_password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error("The two passwords that you entered do not match!")
      );
    },
  }),
  username: ({ getFieldValue }) => ({
    validator(_, value) {
      if (
        !value
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
      ) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Invalid username format!"));
    },
  }),
  assessment_pattern: {
    pattern: new RegExp(
      /(^[E][F]$)|(^[A][I]$)|(^[A][R][T]$)|^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
    ),
    message: "Invalid value",
  },
  quillToolBar: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["image", "video"],
      ["clean"],
    ],
    imageResize: {
      modules: ["Resize", "DisplaySize"],
    },
  },
  quillFormats: [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ],
};

export default validateRules;
