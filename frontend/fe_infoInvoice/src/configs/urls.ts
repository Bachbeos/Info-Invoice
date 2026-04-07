const endpoint = {
  auth: {
    login: "/auth/login",
  },
  invoice: {
    providers: "/auth/providers",
    issue: "/invoice/issue",
    replace: "/invoice/replace",
    adjust: "/invoice/adjust",
    exportXml: "/invoice/export-xml",
    print: "/invoice/print",
    checkTaxStatus: "/invoice/check-tax-status",
  },
} as const;

export default endpoint;
