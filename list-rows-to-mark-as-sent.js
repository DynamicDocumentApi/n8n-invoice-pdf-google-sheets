// n8n Code node "List rows to mark as sent", mode "Run Once for All Items".
// One item per sheet row of the invoices that were emailed, for the update step.
return $('Group lines into invoices').all().flatMap((invoice) =>
  invoice.json.row_numbers.map((row_number) => ({ json: { row_number, status: 'sent' } })),
);
