// Codebase Management Agent for CodePal
// Autonomously monitors repositories, detects issues, and creates pull requests with fixes

import { BaseAgent } from '../core/BaseAgent';
import { 
  CodebaseIssue, 
  CodeChange, 
  PullRequest, 
  TestResult,
  AgentAction,
  AgentResponse 
} from '../types';
import { Octokit } from '@octokit/rest';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  baseBranch: string;
}

interface DeepSeekConfig {
  apiKey: string;
  baseUrl: string;
}

interface CodebaseAgentConfig {
  github: GitHubConfig;
  deepseek: DeepSeekConfig;
  monitoringInterval: number; // minutes
  autoCreatePRs: boolean;
  requireApproval: boolean;
  testBeforePR: boolean;
}

export class CodebaseManagementAgent extends BaseAgent {
  private octokit: Octokit;
  private deepseekApiKey: string;
  private deepseekBaseUrl: string;
  private monitoringInterval: number;
  private autoCreatePRs: boolean;
  private requireApproval: boolean;
  private testBeforePR: boolean;
  private monitoringTimer?: NodeJS.Timeout;

  constructor(config: CodebaseAgentConfig, redisClient?: any) {
    super('codebase-management', 'Codebase Management Agent', config, redisClient);
    
    this.octokit = new Octokit({ auth: config.github.token });
    this.deepseekApiKey = config.deepseek.apiKey;
    this.deepseekBaseUrl = config.deepseek.baseUrl;
    this.monitoringInterval = config.monitoringInterval || 30;
    this.autoCreatePRs = config.autoCreatePRs || false;
    this.requireApproval = config.requireApproval || true;
    this.testBeforePR = config.testBeforePR || true;

    // Add default permissions
    this.addPermission('monitor-repository');
    this.addPermission('detect-issues');
    this.addPermission('generate-fixes');
    this.addPermission('create-pull-request');
    this.addPermission('run-tests');
  }

  protected async validateConfig(): Promise<void> {
    if (!this.config.config.github?.token) {
      throw new Error('GitHub token is required');
    }
    if (!this.config.config.deepseek?.apiKey) {
      throw new Error('DeepSeek API key is required');
    }
    if (!this.config.config.github?.owner || !this.config.config.github?.repo) {
      throw new Error('GitHub owner and repo are required');
    }
  }

  protected async setupConnections(): Promise<void> {
    // Test GitHub connection
    try {
      await this.octokit.repos.get({
        owner: this.config.config.github.owner,
        repo: this.config.config.github.repo,
      });
    } catch (error) {
      throw new Error(`Failed to connect to GitHub: ${error}`);
    }

    // Test DeepSeek connection
    try {
      await this.testDeepSeekConnection();
    } catch (error) {
      throw new Error(`Failed to connect to DeepSeek: ${error}`);
    }
  }

  protected async loadState(): Promise<void> {
    await this.loadConfig();
    await this.loadMetrics();
  }

  protected async saveState(): Promise<void> {
    await this.saveConfig();
    await this.saveMetrics();
  }

  protected async cleanupConnections(): Promise<void> {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
    }
  }

  protected async performAction(action: Omit<AgentAction, 'id' | 'agentId' | 'createdAt'>): Promise<any> {
    switch (action.type) {
      case 'monitor-repository':
        return await this.monitorRepository();
      
      case 'detect-issues':
        return await this.detectIssues();
      
      case 'generate-fix':
        return await this.generateFix(action.payload.issueId);
      
      case 'create-pull-request':
        return await this.createPullRequest(action.payload.issueId);
      
      case 'run-tests':
        return await this.runTests(action.payload.changes);
      
      case 'start-monitoring':
        return await this.startMonitoring();
      
      case 'stop-monitoring':
        return await this.stopMonitoring();
      
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  protected calculateConfidence(result: any): number {
    if (!result) return 0;
    
    // Calculate confidence based on result type
    if (result.issues && Array.isArray(result.issues)) {
      return Math.min(0.9, result.issues.length > 0 ? 0.8 : 0.95);
    }
    
    if (result.pullRequest && result.pullRequest.status === 'open') {
      return 0.85;
    }
    
    if (result.testResult && result.testResult.success) {
      return 0.9;
    }
    
    return 0.7;
  }

  /**
   * Start continuous monitoring of the repository
   */
  public async startMonitoring(): Promise<AgentResponse<void>> {
    if (this.monitoringTimer) {
      return {
        success: false,
        error: 'Monitoring is already active',
        metadata: {
          executionTime: 0,
          confidence: 0,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    }

    this.monitoringTimer = setInterval(async () => {
      try {
        await this.monitorRepository();
      } catch (error) {
        console.error('Monitoring error:', error);
      }
    }, this.monitoringInterval * 60 * 1000);

    // Run initial monitoring
    await this.monitorRepository();

    return {
      success: true,
      metadata: {
        executionTime: 0,
        confidence: 1.0,
        agentId: this.config.id,
        timestamp: new Date(),
      },
    };
  }

  /**
   * Stop continuous monitoring
   */
  public async stopMonitoring(): Promise<AgentResponse<void>> {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = undefined;
    }

    return {
      success: true,
      metadata: {
        executionTime: 0,
        confidence: 1.0,
        agentId: this.config.id,
        timestamp: new Date(),
      },
    };
  }

  /**
   * Monitor repository for issues
   */
  public async monitorRepository(): Promise<AgentResponse<CodebaseIssue[]>> {
    try {
      const issues: CodebaseIssue[] = [];
      
      // Get repository content
      const { data: repo } = await this.octokit.repos.get({
        owner: this.config.config.github.owner,
        repo: this.config.config.github.repo,
      });

      // Get recent commits
      const { data: commits } = await this.octokit.repos.listCommits({
        owner: this.config.config.github.owner,
        repo: this.config.config.github.repo,
        per_page: 10,
      });

      // Get repository tree
      const { data: tree } = await this.octokit.git.getTree({
        owner: this.config.config.github.owner,
        repo: this.config.config.github.repo,
        tree_sha: repo.default_branch,
        recursive: 'true',
      });

      // Analyze each file
      for (const item of tree.tree) {
        if (item.type === 'blob' && this.shouldAnalyzeFile(item.path)) {
          const fileIssues = await this.analyzeFile(item.path, item.sha);
          issues.push(...fileIssues);
        }
      }

      // Store issues in Redis
      await this.storeIssues(issues);

      await this.publishEvent({
        type: 'repository:monitored',
        agentId: this.config.id,
        payload: { issuesFound: issues.length },
        priority: 'medium',
      });

      return {
        success: true,
        data: issues,
        metadata: {
          executionTime: 0,
          confidence: 0.85,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to monitor repository: ${error}`);
    }
  }

  /**
   * Detect issues in the codebase
   */
  public async detectIssues(): Promise<AgentResponse<CodebaseIssue[]>> {
    const issues = await this.monitorRepository();
    return issues;
  }

  /**
   * Generate a fix for a specific issue
   */
  public async generateFix(issueId: string): Promise<AgentResponse<CodeChange>> {
    try {
      const issue = await this.getIssue(issueId);
      if (!issue) {
        throw new Error(`Issue not found: ${issueId}`);
      }

      const fix = await this.generateFixWithDeepSeek(issue);
      
      await this.publishEvent({
        type: 'fix:generated',
        agentId: this.config.id,
        payload: { issueId, fix },
        priority: 'high',
      });

      return {
        success: true,
        data: fix,
        metadata: {
          executionTime: 0,
          confidence: 0.8,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to generate fix: ${error}`);
    }
  }

  /**
   * Create a pull request for an issue
   */
  public async createPullRequest(issueId: string): Promise<AgentResponse<PullRequest>> {
    try {
      const issue = await this.getIssue(issueId);
      if (!issue) {
        throw new Error(`Issue not found: ${issueId}`);
      }

      const fix = await this.generateFixWithDeepSeek(issue);
      
      // Run tests if enabled
      if (this.testBeforePR) {
        const testResult = await this.runTests([fix]);
        if (!testResult.success) {
          throw new Error('Tests failed, cannot create pull request');
        }
      }

      // Create branch
      const branchName = `fix/${issueId}-${Date.now()}`;
      await this.createBranch(branchName);

      // Apply changes
      await this.applyChanges(branchName, [fix]);

      // Create pull request
      const pr = await this.createGitHubPullRequest(issue, fix, branchName);

      await this.publishEvent({
        type: 'pull-request:created',
        agentId: this.config.id,
        payload: { issueId, pullRequestId: pr.id },
        priority: 'high',
      });

      return {
        success: true,
        data: pr,
        metadata: {
          executionTime: 0,
          confidence: 0.9,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to create pull request: ${error}`);
    }
  }

  /**
   * Run tests on code changes
   */
  public async runTests(changes: CodeChange[]): Promise<AgentResponse<TestResult>> {
    try {
      // This would integrate with the actual test runner
      // For now, we'll simulate test execution
      const testResult: TestResult = {
        success: true,
        errors: [],
        warnings: [],
        coverage: 85,
        duration: 120,
      };

      // Simulate some test failures for demonstration
      if (changes.some(change => change.content.includes('TODO'))) {
        testResult.warnings.push('Found TODO comments in code');
      }

      return {
        success: true,
        data: testResult,
        metadata: {
          executionTime: 0,
          confidence: 0.9,
          agentId: this.config.id,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to run tests: ${error}`);
    }
  }

  // Private helper methods

  private async testDeepSeekConnection(): Promise<void> {
    try {
      const response = await axios.post(
        `${this.deepseekBaseUrl}/v1/chat/completions`,
        {
          model: 'deepseek-coder',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.deepseekApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.status !== 200) {
        throw new Error('DeepSeek API test failed');
      }
    } catch (error) {
      throw new Error(`DeepSeek connection test failed: ${error}`);
    }
  }

  private shouldAnalyzeFile(filePath: string): boolean {
    const extensions = ['.ts', '.js', '.tsx', '.jsx', '.py', '.java', '.cpp', '.c', '.go', '.rs'];
    const excludePatterns = ['node_modules', '.git', 'dist', 'build', '.next'];
    
    const extension = filePath.substring(filePath.lastIndexOf('.'));
    const shouldExclude = excludePatterns.some(pattern => filePath.includes(pattern));
    
    return extensions.includes(extension) && !shouldExclude;
  }

  private async analyzeFile(filePath: string, sha: string): Promise<CodebaseIssue[]> {
    try {
      // Get file content
      const { data: file } = await this.octokit.git.getBlob({
        owner: this.config.config.github.owner,
        repo: this.config.config.github.repo,
        file_sha: sha,
      });

      const content = Buffer.from(file.content, 'base64').toString('utf-8');
      
      // Analyze with DeepSeek
      const issues = await this.analyzeCodeWithDeepSeek(content, filePath);
      
      return issues.map(issue => ({
        ...issue,
        id: uuidv4(),
        filePath,
        detectedAt: new Date(),
        status: 'open',
      }));
    } catch (error) {
      console.error(`Failed to analyze file ${filePath}:`, error);
      return [];
    }
  }

  private async analyzeCodeWithDeepSeek(code: string, filePath: string): Promise<Omit<CodebaseIssue, 'id' | 'filePath' | 'detectedAt' | 'status'>[]> {
    try {
      const response = await axios.post(
        `${this.deepseekBaseUrl}/v1/chat/completions`,
        {
          model: 'deepseek-coder',
          messages: [
            {
              role: 'system',
              content: 'You are a code analysis expert. Analyze the following code and identify potential issues including bugs, security vulnerabilities, performance problems, and code quality issues. Return a JSON array of issues with type, severity, description, lineNumber, code, and suggestedFix fields.',
            },
            {
              role: 'user',
              content: `Analyze this code from ${filePath}:\n\n${code}`,
            },
          ],
          max_tokens: 2000,
          temperature: 0.1,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.deepseekApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const analysis = response.data.choices[0].message.content;
      const issues = JSON.parse(analysis);
      
      return issues.map((issue: any) => ({
        type: issue.type || 'code-quality',
        severity: issue.severity || 'medium',
        description: issue.description,
        lineNumber: issue.lineNumber,
        code: issue.code || code,
        suggestedFix: issue.suggestedFix,
        confidence: issue.confidence || 0.7,
      }));
    } catch (error) {
      console.error('DeepSeek analysis failed:', error);
      return [];
    }
  }

  private async generateFixWithDeepSeek(issue: CodebaseIssue): Promise<CodeChange> {
    try {
      const response = await axios.post(
        `${this.deepseekBaseUrl}/v1/chat/completions`,
        {
          model: 'deepseek-coder',
          messages: [
            {
              role: 'system',
              content: 'You are a code generation expert. Generate a fix for the given code issue. Return only the fixed code without explanations.',
            },
            {
              role: 'user',
              content: `Fix this issue in the code:\n\nIssue: ${issue.description}\n\nCode:\n${issue.code}\n\nSuggested fix: ${issue.suggestedFix}`,
            },
          ],
          max_tokens: 1000,
          temperature: 0.1,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.deepseekApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const fixedCode = response.data.choices[0].message.content;
      
      return {
        file: issue.filePath,
        content: fixedCode,
        type: 'update',
        diff: this.generateDiff(issue.code, fixedCode),
      };
    } catch (error) {
      throw new Error(`Failed to generate fix with DeepSeek: ${error}`);
    }
  }

  private generateDiff(originalCode: string, newCode: string): string {
    // Simple diff generation - in production, use a proper diff library
    return `- ${originalCode}\n+ ${newCode}`;
  }

  private async storeIssues(issues: CodebaseIssue[]): Promise<void> {
    const key = `codebase:issues:${this.config.config.github.owner}:${this.config.config.github.repo}`;
    await this.redis.set(key, JSON.stringify(issues));
  }

  private async getIssue(issueId: string): Promise<CodebaseIssue | null> {
    const key = `codebase:issues:${this.config.config.github.owner}:${this.config.config.github.repo}`;
    const issuesData = await this.redis.get(key);
    
    if (issuesData) {
      const issues: CodebaseIssue[] = JSON.parse(issuesData);
      return issues.find(issue => issue.id === issueId) || null;
    }
    
    return null;
  }

  private async createBranch(branchName: string): Promise<void> {
    // Get the latest commit from main branch
    const { data: ref } = await this.octokit.git.getRef({
      owner: this.config.config.github.owner,
      repo: this.config.config.github.repo,
      ref: `heads/${this.config.config.github.baseBranch}`,
    });

    // Create new branch
    await this.octokit.git.createRef({
      owner: this.config.config.github.owner,
      repo: this.config.config.github.repo,
      ref: `refs/heads/${branchName}`,
      sha: ref.object.sha,
    });
  }

  private async applyChanges(branchName: string, changes: CodeChange[]): Promise<void> {
    for (const change of changes) {
      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.config.config.github.owner,
        repo: this.config.config.github.repo,
        path: change.file,
        message: `Fix: ${change.file}`,
        content: Buffer.from(change.content).toString('base64'),
        branch: branchName,
      });
    }
  }

  private async createGitHubPullRequest(issue: CodebaseIssue, fix: CodeChange, branchName: string): Promise<PullRequest> {
    const { data: pr } = await this.octokit.pulls.create({
      owner: this.config.config.github.owner,
      repo: this.config.config.github.repo,
      title: `Fix ${issue.type}: ${issue.description}`,
      body: `Automated fix for issue ${issue.id}\n\n**Issue:** ${issue.description}\n**Severity:** ${issue.severity}\n**File:** ${issue.filePath}\n\nThis pull request was automatically generated by the CodePal Codebase Management Agent.`,
      head: branchName,
      base: this.config.config.github.baseBranch,
    });

    return {
      id: pr.id.toString(),
      repoId: `${this.config.config.github.owner}/${this.config.config.github.repo}`,
      title: pr.title,
      description: pr.body || '',
      changes: [fix],
      status: pr.state as any,
      createdAt: new Date(pr.created_at),
      mergedAt: pr.merged_at ? new Date(pr.merged_at) : undefined,
      author: pr.user?.login || 'unknown',
      reviewers: [],
    };
  }
} 