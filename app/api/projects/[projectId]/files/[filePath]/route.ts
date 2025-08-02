import { NextRequest, NextResponse } from 'next/server'
import { ProjectService } from '@/backend/api/projects/project.service'
import { PrismaService } from '@/backend/api/database/prisma.service'

const projectService = new ProjectService(new PrismaService())

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; filePath: string } }
) {
  try {
    const userId = 'test-user' // TODO: Get from auth
    const filePath = decodeURIComponent(params.filePath)

    const content = await projectService.getFileContent(userId, params.projectId, filePath)
    
    return NextResponse.json({ content })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string; filePath: string } }
) {
  try {
    const { content, commitMessage } = await request.json()
    const userId = 'test-user' // TODO: Get from auth
    const filePath = decodeURIComponent(params.filePath)

    await projectService.updateFileContent(userId, params.projectId, filePath, content, commitMessage)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string; filePath: string } }
) {
  try {
    const userId = 'test-user' // TODO: Get from auth
    const filePath = decodeURIComponent(params.filePath)

    await projectService.deleteFile(userId, params.projectId, filePath)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
} 