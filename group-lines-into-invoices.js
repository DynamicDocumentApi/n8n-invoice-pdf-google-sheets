// Turns the sheet's rows (one row per invoice line) into one item per invoice, in the
// EN 16931 invoice model the gallery's invoice templates read. Only rows with status "ready".
// Stops before anything is rendered or sent if a ready row is incomplete.

const details = $('Set your business details').first().json;
const seller = {
  name: details.seller_name,
  vat_id: details.seller_vat_id,
  address: {
    line1: details.seller_street,
    city: details.seller_city,
    postcode: details.seller_postcode,
    country: details.seller_country,
  },
  contact: { name: details.seller_contact_name, email: details.seller_email },
};
const bank = { account_id: details.iban, account_name: details.seller_name, bic: details.bic };

const required = ['invoice_number', 'issue_date', 'due_date', 'customer_name', 'customer_email', 'item', 'quantity', 'unit_price', 'vat_rate'];
const isoDate = /^\d{4}-\d{2}-\d{2}$/;
const problems = [];

const invoices = new Map();
for (const { json: row } of $input.all()) {
  if (String(row.status).trim().toLowerCase() !== 'ready') continue;

  const missing = required.filter((field) => String(row[field] ?? '').trim() === '');
  if (missing.length) problems.push(`row ${row.row_number}: ${missing.join(', ')} empty`);
  for (const field of ['issue_date', 'due_date']) {
    if (row[field] && !isoDate.test(String(row[field]))) {
      problems.push(`row ${row.row_number}: ${field} "${row[field]}" is not YYYY-MM-DD (format the column as plain text)`);
    }
  }
  for (const field of ['quantity', 'unit_price', 'vat_rate']) {
    if (row[field] !== '' && !Number.isFinite(Number(row[field]))) {
      problems.push(`row ${row.row_number}: ${field} "${row[field]}" is not a number`);
    }
  }
  if (problems.length) continue;

  const number = String(row.invoice_number).trim();
  if (!invoices.has(number)) {
    invoices.set(number, {
      invoice: {
        number,
        issue_date: row.issue_date,
        due_date: row.due_date,
        currency: details.currency,
        payment_terms: details.payment_terms,
        delivery: { date: row.issue_date },
        seller,
        buyer: {
          name: row.customer_name,
          address: {
            line1: row.customer_street,
            city: row.customer_city,
            postcode: row.customer_postcode,
            country: details.customer_country,
          },
          contact: { email: row.customer_email },
        },
        payment: { means_code: '30', remittance_information: number, credit_transfers: [bank] },
        lines: [],
      },
      customer_email: row.customer_email,
      row_numbers: [],
    });
  }

  invoices.get(number).row_numbers.push(row.row_number);

  invoices.get(number).invoice.lines.push({
    quantity: String(row.quantity),
    unit: row.unit || 'EA',
    price: { net: Number(row.unit_price).toFixed(2) },
    tax: { category: 'S', rate: String(row.vat_rate) },
    item: { name: row.item, description: row.description || undefined },
  });
}

if (problems.length) {
  throw new Error(`Nothing was sent. Fix these rows first: ${problems.join('; ')}`);
}

return [...invoices.values()].map((json) => ({ json }));
