-- Complete production database schema
-- Version: 1.0.0
-- Created: 2024

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table with complete profile management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    company VARCHAR(255),
    location VARCHAR(255),
    website_url TEXT,
    github_username VARCHAR(100),
    twitter_username VARCHAR(100),
    linkedin_url TEXT,
    settings JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    subscription_tier VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(50) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Projects table with comprehensive project management
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) DEFAULT 'web',
    framework VARCHAR(50) DEFAULT 'react',
    template VARCHAR(100),
    repository_url TEXT,
    live_url TEXT,
    preview_url TEXT,
    settings JSONB DEFAULT '{}',
    environment_variables JSONB DEFAULT '{}',
    build_settings JSONB DEFAULT '{}',
    deployment_settings JSONB DEFAULT '{}',
    collaborator_settings JSONB DEFAULT '{}',
    visibility VARCHAR(20) DEFAULT 'private',
    status VARCHAR(50) DEFAULT 'active',
    last_deployed TIMESTAMP,
    deploy_count INTEGER DEFAULT 0,
    file_count INTEGER DEFAULT 0,
    total_size BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Project files with version control
CREATE TABLE project_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    path VARCHAR(500) NOT NULL,
    content TEXT,
    content_hash VARCHAR(64),
    size BIGINT DEFAULT 0,
    mime_type VARCHAR(100),
    encoding VARCHAR(50) DEFAULT 'utf-8',
    is_binary BOOLEAN DEFAULT FALSE,
    is_directory BOOLEAN DEFAULT FALSE,
    parent_path VARCHAR(500),
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, path)
);

-- File versions for complete version control
CREATE TABLE file_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES project_files(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    content TEXT,
    content_hash VARCHAR(64),
    size BIGINT DEFAULT 0,
    change_type VARCHAR(20) DEFAULT 'modified',
    commit_message TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(file_id, version)
);

-- Deployments with comprehensive tracking
CREATE TABLE deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    environment VARCHAR(50) DEFAULT 'production',
    status VARCHAR(50) DEFAULT 'pending',
    deployment_type VARCHAR(50) DEFAULT 'standard',
    source_branch VARCHAR(100) DEFAULT 'main',
    commit_hash VARCHAR(40),
    build_id VARCHAR(100),
    build_logs TEXT,
    deployment_logs TEXT,
    error_logs TEXT,
    config JSONB DEFAULT '{}',
    metrics JSONB DEFAULT '{}',
    url TEXT,
    preview_url TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project collaborators
CREATE TABLE project_collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'viewer',
    permissions JSONB DEFAULT '{}',
    invited_by UUID REFERENCES users(id),
    invitation_token VARCHAR(255),
    invitation_status VARCHAR(50) DEFAULT 'pending',
    joined_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

-- API keys for external integrations
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    permissions JSONB DEFAULT '{}',
    last_used TIMESTAMP,
    usage_count INTEGER DEFAULT 0,
    rate_limit INTEGER DEFAULT 1000,
    expires_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(key_hash)
);

-- Activity logs for audit trail
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usage analytics
CREATE TABLE usage_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System settings and feature flags
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);

CREATE INDEX idx_project_files_project_id ON project_files(project_id);
CREATE INDEX idx_project_files_path ON project_files(path);
CREATE INDEX idx_project_files_updated_at ON project_files(updated_at);

CREATE INDEX idx_deployments_project_id ON deployments(project_id);
CREATE INDEX idx_deployments_status ON deployments(status);
CREATE INDEX idx_deployments_created_at ON deployments(created_at);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_project_id ON activity_logs(project_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_files_updated_at BEFORE UPDATE ON project_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default system settings
INSERT INTO system_settings (key, value, description, is_public) VALUES
('app_name', '"CodePal"', 'Application name', true),
('app_version', '"1.0.0"', 'Application version', true),
('maintenance_mode', 'false', 'Maintenance mode flag', false),
('max_projects_per_user', '10', 'Maximum projects per user', false),
('max_file_size_mb', '10', 'Maximum file size in MB', false),
('supported_frameworks', '["react", "vue", "angular", "svelte", "next", "nuxt"]', 'Supported frameworks', true),
('deployment_regions', '["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"]', 'Available deployment regions', true);

-- Create database functions for common operations
CREATE OR REPLACE FUNCTION get_user_project_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM projects WHERE user_id = user_uuid AND deleted_at IS NULL);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_project_file_count(project_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM project_files WHERE project_id = project_uuid AND is_directory = FALSE);
END;
$$ LANGUAGE plpgsql;

-- Create views for common queries
CREATE VIEW user_project_summary AS
SELECT 
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    COUNT(p.id) as project_count,
    MAX(p.updated_at) as last_project_update,
    SUM(p.file_count) as total_files,
    SUM(p.total_size) as total_size_bytes
FROM users u
LEFT JOIN projects p ON u.id = p.user_id AND p.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email, u.first_name, u.last_name;

CREATE VIEW project_deployment_summary AS
SELECT 
    p.id as project_id,
    p.name,
    p.user_id,
    COUNT(d.id) as deployment_count,
    MAX(d.completed_at) as last_deployment,
    COUNT(CASE WHEN d.status = 'success' THEN 1 END) as successful_deployments,
    COUNT(CASE WHEN d.status = 'failed' THEN 1 END) as failed_deployments
FROM projects p
LEFT JOIN deployments d ON p.id = d.project_id
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.name, p.user_id;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO codepal_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO codepal_app;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO codepal_app;

-- Convention: Log RBAC/role changes in activity_logs
-- For role changes:
--   action: 'role_changed'
--   resource_type: 'user'
--   resource_id: <user_id>
--   details: { "old_role": <old>, "new_role": <new>, "changed_by": <admin_id> }
-- Example insert:
-- INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent)
-- VALUES (<admin_id>, 'role_changed', 'user', <user_id>, '{"old_role": "user", "new_role": "admin", "changed_by": "<admin_id>"}', <ip>, <ua>);
