const ironOptions = {
  cookieName: "siwe",
  password: "123456789009876543211234567890lk",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export default ironOptions;
