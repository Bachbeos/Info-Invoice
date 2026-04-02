const endpoint = {
  auth: {
    login: "/invoice/login",
  },
  invoice: {
    providers: "/invoice/providers",
  },
} as const;

export default endpoint;
