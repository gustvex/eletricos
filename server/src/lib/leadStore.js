import { appendFile, mkdir, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'

import { config } from './config.js'

const filePath = resolve(process.cwd(), config.leadsFile)

/**
 * Persistencia simples em JSON Lines: cada lead e uma linha.
 * Zero dependencia de banco e facil de abrir no Excel/Sheets depois.
 * Se o volume crescer, troque so este modulo por um Postgres/Supabase.
 */
export async function saveLead(lead) {
  const record = { id: randomUUID(), createdAt: new Date().toISOString(), ...lead }
  await mkdir(dirname(filePath), { recursive: true })
  await appendFile(filePath, `${JSON.stringify(record)}\n`, 'utf8')
  return record
}

export async function listLeads({ limit = 100 } = {}) {
  try {
    const content = await readFile(filePath, 'utf8')
    return content
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line)
        } catch {
          return null
        }
      })
      .filter(Boolean)
      .slice(-limit)
      .reverse()
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

export default { saveLead, listLeads }
