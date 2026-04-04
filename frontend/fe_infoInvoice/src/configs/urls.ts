const endpoint = {
  auth: {
    login: "/invoice/login",
  },
  invoice: {
    providers: "/invoice/providers",
    issue: "/invoice/issue",
  },
} as const;

export default endpoint;
