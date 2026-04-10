const endpoint = {
  auth: {
    login: "/auth/login",
    providerConfigs: "/auth/provider-configs",
  },
  invoice: {
    providers: "/auth/providers",
    issue: "/invoice/issue",
    replace: "/invoice/replace",
    adjust: "/invoice/adjust",
    list: "/invoice/list",
    detail: "/invoice",
    exportXml: "/invoice/export-xml",
    print: "/invoice/print",
    checkTaxStatus: "/invoice/check-tax-status",
  },
} as const;

export default endpoint;
