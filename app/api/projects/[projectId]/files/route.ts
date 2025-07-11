import { NextRequest, NextResponse } from 'next/server'
import { ProjectService } from '@/backend/api/projects/project.service'
import { PrismaService } from '@/backend/api/database/prisma.service'

const projectService = new ProjectService(new PrismaService())

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')
    const userId = 'test-user' // TODO: Get from auth

    const files = await projectService.getProjectFiles(userId, params.projectId, path || undefined)
    
    return NextResponse.json({ files })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { filePath, content } = await request.json()
    const userId = 'test-user' // TODO: Get from auth

    await projectService.updateFileContent(userId, params.projectId, filePath, content)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
} 