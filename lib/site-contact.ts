// Public business contact details read from https://saavantus.com/ on 2026-10-21.
// Preserve the site's published phone links rather than infer a country code.
export const siteContact = {
  email: "support@saavantus.com",
  emailHref: "mailto:support@saavantus.com",
  phones: [
    { label: "08031686962", href: "tel:08031686962" },
    { label: "9845718730", href: "tel:9845718730" },
  ],
  sourceUrl: "https://saavantus.com/",
  verifiedDate: "2026-10-21",
} as const;
