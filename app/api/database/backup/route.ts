import { NextRequest, NextResponse } from 'next/server'
import { DatabaseBackupService } from '../../../backend/api/database/backup.service'

const backupService = new DatabaseBackupService(
  { get: (key: string) => process.env[key] } as any,
  { emit: () => {} } as any
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'list':
        const backups = await backupService.listBackups()
        return NextResponse.json({ backups })

      case 'health':
        const health = await backupService.getBackupHealth()
        return NextResponse.json(health)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, backupId, targetPath } = await request.json()

    switch (action) {
      case 'create':
        const backup = await backupService.createBackup()
        return NextResponse.json({ backup })

      case 'restore':
        await backupService.restoreBackup(backupId, targetPath)
        return NextResponse.json({ success: true, message: 'Backup restored successfully' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 