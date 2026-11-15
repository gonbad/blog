# Claude subscription tax — clarified purchase and billing assumptions

Checked 9 November 2026. The owner clarified that the tie-break concerns **Claude subscription tax**, not VPS Market's invoice. When VPS prices tie, compare the applicable subscription tax; do not silently switch the purchase being compared.

Anthropic says tax is determined by the billing address. For self-serve Pro/Max plans, that address comes from the payment method. Therefore moving an existing subscription's working environment to a Canadian VPS does not by itself change its tax. [Primary billing documentation](https://support.claude.com/en/articles/12997130-understanding-your-billing-address-and-tax-calculation).

| Billing-region reference | Published rates | Meaning for this comparison |
| --- | --- | --- |
| Canada | Federal GST 5%; province-dependent additional tax/HST. Ontario 13% HST; Quebec GST+QST 14.975%; several HST provinces 15%. | Do not call every Canadian purchase 5%. Use the actual billing province and checkout. |
| Germany | Standard VAT 19% | Reference rate for a comparable taxable consumer purchase, not a verified account-specific invoice. |
| France | Standard VAT 20% | Same comparison assumptions; not a 15% flat European rate. |
| EU framework | Minimum standard rate 15%; actual national rates vary | 15% is a floor, not the applicable rate everywhere in Europe. |

Sources: [Canada Revenue Agency rates](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html), [EU official rate table](https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm), [EU VAT framework](https://taxation-customs.ec.europa.eu/taxation/vat/vat-directive/vat-rates_en).

Project selection: use CA 4 Canada among the tied VPS examples, following the owner's tie-break preference. This is a tutorial example under the consumer billing-rate comparison, not evidence that server location controls billing, that a reader has a Canadian billing address, or that their invoice will be exactly 5%. Exemptions, business treatment, purchase channels, currency and actual checkout can change the total. No account-specific subscription checkout or payment was performed.

The article keeps this in the server slide's expandable explanation. The tutorial still assumes an existing subscription and changes its working environment; it does not instruct readers to fabricate billing details or change a payment address to match a VPS.
