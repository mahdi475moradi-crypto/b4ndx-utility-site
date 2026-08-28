# No-Cost Custom-Style Domain Research for B4NDX Utility

## Verified option

**EU.org** is the closest credible no-cost option for a user-owned-looking address. Its official site states that it provides **free subdomain registration** to individuals and non-profit organisations unable to afford conventional registration. A suitable requested name would be `b4ndxutility.eu.org`, subject to availability and EU.org approval.

## Important trade-off

This is a delegated **subdomain**, not a paid top-level domain. It may require a manual registration and DNS setup, and it is not an automatic, instant “lifetime custom domain” guarantee. Avoid unverified sites advertising free `.com`, `.gg`, `.tk`, or similar top-level domains.

## Cloudflare Pages connection

Cloudflare Pages requires the domain/subdomain to be added through **Workers & Pages → project → Custom domains**. For an externally managed subdomain, Cloudflare documents using a **CNAME** from the selected hostname to the Pages project’s `*.pages.dev` address. The custom domain should be associated inside Pages before DNS is added to avoid resolution errors.

## Sources

- https://nic.eu.org/
- https://developers.cloudflare.com/pages/configuration/custom-domains/
