# Title

Create and email PDF invoices from Google Sheets rows with Gmail

# Description

## Who it's for

Freelancers, agencies and small businesses that keep billable work in a Google Sheet and want to send real PDF invoices without copying the data into an invoicing tool.

## How it works

1. Reads every row of a Google Sheet. Each row is one invoice line. Rows with the same `invoice_number` become one invoice, and only rows with the status `ready` are used.
2. Checks the ready rows: required fields, numbers, and dates in `YYYY-MM-DD`. If a row is incomplete, the workflow stops before anything is rendered or sent and lists the rows to fix.
3. Groups the lines into one invoice per number, in the EN 16931 invoice model, with your company and bank details from the **Set your business details** node.
4. Renders each invoice as a PDF with the verified Dynamic Document API node and an invoice template from its gallery. The template calculates the line totals, the VAT breakdown and the amount due.
5. Emails each PDF to the customer with Gmail.
6. Sets the invoice's rows to `sent`, so the next run skips them. With no `ready` rows left, a run ends after the grouping step and sends nothing.

On the Growth plan and higher, the gallery's invoice templates also embed Factur-X / ZUGFeRD XML, so the PDF is an e-invoice that accounting software can read.

## Requirements

- A Google account for the Google Sheets and Gmail credentials.
- A Dynamic Document API account. The free plan works: a test key renders free PDFs with a TEST watermark.
- The verified community node `@dynamic-document-api/n8n-nodes-dynamic-document-api`, tested with version 0.1.1. It works on n8n Cloud and self-hosted. [Installation and credentials](https://dynamicdocumentapi.com/docs/n8n)

Tested on n8n Cloud 2.45.7.

## How to set up

1. Import the [sample sheet](https://dynamicdocumentapi.com/assets/tutorials/invoices-sheet.csv) into Google Sheets (**File → Import → Upload**). Clear **Convert text to numbers, dates, and formulas** so the dates stay plain text.
2. Install the node: open the nodes panel, search for **Dynamic Document API** and choose **Install node**.
3. In the [Dynamic Document API dashboard](https://app.dynamicdocumentapi.com/signup), add an invoice template from the gallery, for example **Bold brand invoice**, and create an API key with the scopes `render:write`, `renders:read` and `templates:read`.
4. Connect your Google Sheets, Gmail and Dynamic Document API credentials.
5. Pick your document and sheet in **Read invoice rows** and **Mark rows as sent**. Picking the sheet in **Mark rows as sent** resets its columns: set **Mapping Column Mode** to **Map Automatically** and **Column to match on** to `row_number`.
6. Select your template in **Create a PDF from a template**.
7. Enter your company and bank details in **Set your business details**.
8. For the first run, put your own address in **To** in **Email the invoice**: the sample sheet uses `example.com` addresses. Then choose **Execute workflow**.

## How to customize

- Replace the manual trigger with a **Schedule Trigger**, for example every weekday at 9:00.
- Add **Google Drive → Upload file** after the PDF node to keep a copy of each invoice.
- Switch to any other invoice template from the gallery. They all read the same invoice object, so the workflow stays the same.
- `customer_country` in **Set your business details** applies to every customer. Add a column to the sheet if your customers are in different countries.

## Limitations

- If Gmail fails partway through, the rows stay `ready`, and a rerun sends the invoices that already went out again. Check your sent folder before you rerun.
- Every line uses the standard VAT category `S`. Reverse charge or exempt lines need a change in the **Group lines into invoices** code.

A step-by-step tutorial with screenshots: [Invoice PDFs from Google Sheets with n8n](https://dynamicdocumentapi.com/docs/tutorials/invoice-pdfs-google-sheets-n8n)
