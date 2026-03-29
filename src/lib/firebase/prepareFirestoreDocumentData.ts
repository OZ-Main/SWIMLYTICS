import type { DocumentData } from 'firebase/firestore'

import { sanitizeFirestoreNumbersDeep } from '@/lib/firebase/sanitizeFirestoreNumbersDeep'
import { stripUndefinedDeep } from '@/lib/firebase/stripUndefinedDeep'

export function prepareFirestoreDocumentData<T>(value: T): DocumentData {
  return sanitizeFirestoreNumbersDeep(stripUndefinedDeep(value)) as DocumentData
}
