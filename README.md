# Invoice PDFs from Google Sheets with n8n

An [n8n](https://n8n.io) workflow that turns rows in a Google Sheet into branded PDF invoices, emails each one with
Gmail and marks the rows as sent, with the verified [Dynamic Document API](https://dynamicdocumentapi.com/) node.

![The workflow with its notes: set your details, read the rows, group them into invoices, create the PDFs, email them, mark the rows as sent](docs/01-workflow.webp)

The step-by-step tutorial with screenshots:
**[Invoice PDFs from Google Sheets with n8n](https://dynamicdocumentapi.com/docs/tutorials/invoice-pdfs-google-sheets-n8n)**.

## What's in here

| File | What it is |
|---|---|
| `invoice-pdfs-from-google-sheets.json` | The workflow, with setup notes on the canvas. In n8n: new workflow, three-dot menu at the top → **Import from File** |
| `invoices-sheet.csv` | Sample sheet: two invoices ready to send, one draft |
| `group-lines-into-invoices.js` | The first Code step: checks the `ready` rows and groups them into invoices in the EN 16931 invoice model |
| `list-rows-to-mark-as-sent.js` | The second Code step: one item per sheet row for the update step |
| `docs/example-invoice-INV-2026-102.pdf` | An invoice the workflow created with a test key |
| `creator-hub/` | Title, description and workflow image for the n8n template library |

## Set it up

1. Import `invoices-sheet.csv` into a new Google Sheet called **Invoices** (**File** → **Import**, clear
   **Convert text to numbers, dates, and formulas**).
2. In the Dynamic Document API dashboard, add an invoice template from the gallery to your workspace, for example
   **Bold brand invoice**, and create an API key. A test key (`dda_test_…`) renders free PDFs with a TEST watermark.
   [Sign up free](https://app.dynamicdocumentapi.com/signup).
3. In n8n, install the **Dynamic Document API** node from the nodes panel, then import the workflow.
4. Connect your Google Sheets, Gmail and Dynamic Document API credentials, pick your sheet in **Read invoice rows**
   and **Mark rows as sent**, and your template in **Create a PDF from a template**.
5. In **Mark rows as sent**, set **Mapping Column Mode** to **Map Automatically** and **Column to match on** to
   `row_number` again. Picking the sheet resets them.
6. Enter your company and bank details in **Set your business details**.
7. Put your own email address in **To** in **Email the invoice** for the first test, then choose **Execute workflow**.

If a `ready` row is incomplete or a date isn't `YYYY-MM-DD`, the workflow stops before anything is rendered or sent
and lists the rows to fix. Tested on n8n Cloud 2.45.7 with the node version 0.1.1.

When Google asks for permissions, tick every box. Without the Google Sheets permission, n8n finds the document but
every read fails with `404 Requested entity was not found`.

![The invoice PDF for INV-2026-102 with three lines, 23 % VAT and a total due of €1,378.83](docs/07-invoice-pdf.webp)

On the Growth plan and higher, the gallery's invoice templates also embed the invoice as Factur-X / ZUGFeRD XML.
On Free and Starter you get a plain PDF.

## Learn more

- [The n8n node](https://dynamicdocumentapi.com/docs/n8n)
- [E-invoicing](https://dynamicdocumentapi.com/docs/e-invoicing)
- [Invoice PDF API](https://dynamicdocumentapi.com/invoice-pdf-api/)

## License

MIT. Names, addresses and figures in the sample data are invented.
