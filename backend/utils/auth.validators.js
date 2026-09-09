export const isEmpty = (value) => {
    return (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    );
};


export const validateEmail = (email) => {

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
    // Convert to string in case a numeric value is passed
    const phone = String(phoneNumber ?? "");

    if (!phone) {
        return { valid: false, message: "Phone number is required" };
    }

    // ^01 = starts with 01
    // \d{9}$ = followed by exactly 9 more digits (total = 11 digits)
    if (!/^01\d{9}$/.test(phone)) {
        return {
            valid: false,
            message: "Phone number must start with '01' and be exactly 11 digits long",
        };
    }

    return { valid: true, message: "Phone number is valid" };
};

// export const validatePassword = (password) => {

//     return (
//         typeof password === "string" &&
//         password.length <= 8
//     );
// };

export const validatePassword = (password) => {
    return (
        typeof password === "string" &&
        password.length >= 4 &&
        password.length <= 8
    );
};