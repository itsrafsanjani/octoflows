import ActionSection from '@/Components/ActionSection'
import { Button } from '@/Components/shadcn/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/shadcn/ui/table'
import { Icon } from '@iconify/react'

const DEFAULT_INVOICES = []

export default function InvoiceManager({ invoices = DEFAULT_INVOICES }) {
  return (
    <ActionSection
      title="Manage Invoices"
      description={(
        <span className="flex items-center space-x-2">
          View and download your past invoices.
        </span>
      )}
      content={(
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Invoice #</TableHead>
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead className="hidden sm:table-cell">Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
                <TableHead className="w-[50px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map(invoice => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {invoice.id}
                    <div className="sm:hidden text-sm text-muted-foreground">
                      {invoice.customer_name}
                      {' '}
                      •
                      {invoice.status}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(invoice.created * 1000).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {invoice.customer_name}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {invoice.status}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    $
                    {(invoice.amount_paid / 100).toFixed(2)}
                  </TableCell>
                  <TableCell className="p-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="size-8"
                    >
                      <a
                        href={invoice.hosted_invoice_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center"
                      >
                        <Icon icon="lucide:download" className="size-4" />
                        <span className="sr-only">Download Invoice</span>
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    />
  )
}
