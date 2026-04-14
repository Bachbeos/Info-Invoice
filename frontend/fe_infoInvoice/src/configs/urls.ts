const endpoint = {
  auth: {
    login: "/auth/login",
    providerConfigs: "/auth/provider-configs",
    providers: "/auth/providers",
  },
  invoice: {
    add: "/invoice/add",
    update: "/invoice/update",
    delete: "/invoice/delete",
    list: "/invoice/list",
    detail: "/invoice/get",
    exportXml: "/invoice/export-xml",
    print: "/invoice/print",
    checkTaxStatus: "/invoice/check-tax-status",
  },
} as const;

export default endpoint;
