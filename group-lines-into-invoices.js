// n8n Code node "Group lines into invoices", mode "Run Once for All Items".
// Turns the sheet's rows (one row per invoice line) into one item per invoice, in the
// EN 16931 invoice model the gallery's invoice templates read. Only rows with status "ready".

const seller = {
  name: "Brambleworth Design Studio",
  vat_id: "IE1234567T",
  address: { line1: "Unit 4, Tannery Yard", city: "Dublin", postcode: "D08 VF8H", country: "IE" },
  contact: { name: "Accounts team", email: "accounts@brambleworth.example.com" },
};
const bank = { account_id: "IE29AIBK93115212345678", account_name: seller.name, bic: "AIBKIE2D" };

const invoices = new Map();
for (const { json: row } of $input.all()) {
  if (String(row.status).trim().toLowerCase() !== "ready") continue;

  const number = String(row.invoice_number).trim();
  if (!invoices.has(number)) {
    invoices.set(number, {
      invoice: {
        number,
        issue_date: row.issue_date,
        due_date: row.due_date,
        currency: "EUR",
        payment_terms: "30 days net",
        delivery: { date: row.issue_date },
        seller,
        buyer: {
          name: row.customer_name,
          address: { line1: row.customer_street, city: row.customer_city, postcode: row.customer_postcode, country: "IE" },
          contact: { email: row.customer_email },
        },
        payment: { means_code: "30", remittance_information: number, credit_transfers: [bank] },
        lines: [],
      },
      customer_email: row.customer_email,
      row_numbers: [],
    });
  }

  invoices.get(number).row_numbers.push(row.row_number);

  invoices.get(number).invoice.lines.push({
    quantity: String(row.quantity),
    unit: row.unit || "EA",
    price: { net: Number(row.unit_price).toFixed(2) },
    tax: { category: "S", rate: String(row.vat_rate) },
    item: { name: row.item, description: row.description || undefined },
  });
}

return [...invoices.values()].map((json) => ({ json }));
