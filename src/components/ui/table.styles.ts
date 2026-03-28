import { cva } from 'class-variance-authority'

export const tableWrapperVariants = cva('relative w-full overflow-auto')

export const tableRootVariants = cva('w-full caption-bottom text-body')

export const tableHeaderVariants = cva('bg-muted/35 [&_tr]:border-b [&_tr]:border-border')

export const tableBodyVariants = cva('[&_tr:last-child]:border-0')

export const tableFooterVariants = cva(
  'border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0',
)

export const tableRowVariants = cva(
  'border-b border-border transition-colors duration-motion-normal ease-motion-out hover:bg-muted/50 data-[state=selected]:bg-muted',
)

export const tableHeadVariants = cva(
  'h-11 px-table-x text-left align-middle text-label font-semibold text-muted-foreground [&:has([role=checkbox])]:pr-0',
)

export const tableCellVariants = cva(
  'px-table-x py-table-y align-middle [&:has([role=checkbox])]:pr-0',
)

export const tableCaptionVariants = cva('mt-4 text-caption text-muted-foreground')
