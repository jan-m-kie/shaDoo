-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    charter TEXT,
    goals TEXT,
    phases JSONB DEFAULT '[]',
    milestones JSONB DEFAULT '[]',
    risk_management_plan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stakeholders table
CREATE TABLE stakeholders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    department VARCHAR(100),
    contact_info VARCHAR(200),
    information_needs JSONB DEFAULT '[]',
    preferred_channels JSONB DEFAULT '[]',
    preferred_formats JSONB DEFAULT '[]',
    communication_frequency VARCHAR(50),
    escalation_path TEXT,
    decision_authority TEXT,
    timezone VARCHAR(50),
    availability TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communication plans table
CREATE TABLE communication_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    company_guidelines TEXT,
    available_technologies JSONB DEFAULT '[]',
    documentation_standards TEXT,
    compliance_requirements TEXT,
    information_types JSONB DEFAULT '[]',
    confidentiality_requirements TEXT,
    language_considerations TEXT,
    cultural_considerations TEXT,
    communication_budget DECIMAL(10,2),
    budget_breakdown TEXT,
    feedback_mechanisms TEXT,
    update_procedures TEXT,
    effectiveness_metrics TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communication matrix table
CREATE TABLE communication_matrix (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    communication_plan_id UUID REFERENCES communication_plans(id) ON DELETE CASCADE,
    who_sender VARCHAR(100),
    who_receiver VARCHAR(100),
    what_content TEXT,
    when_frequency VARCHAR(50),
    when_timing VARCHAR(100),
    how_channel VARCHAR(50),
    how_format VARCHAR(50),
    why_purpose TEXT,
    priority VARCHAR(20),
    confirmation_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_stakeholders_project_id ON stakeholders(project_id);
CREATE INDEX idx_communication_plans_project_id ON communication_plans(project_id);
CREATE INDEX idx_communication_matrix_plan_id ON communication_matrix(communication_plan_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stakeholders_updated_at BEFORE UPDATE ON stakeholders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_communication_plans_updated_at BEFORE UPDATE ON communication_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_communication_matrix_updated_at BEFORE UPDATE ON communication_matrix FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_matrix ENABLE ROW LEVEL SECURITY;

-- Create policies (basic policies, adjust as needed)
CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON users FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON users FOR DELETE USING (true);

CREATE POLICY "Enable read access for all projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all projects" ON projects FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all projects" ON projects FOR DELETE USING (true);

CREATE POLICY "Enable read access for all stakeholders" ON stakeholders FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all stakeholders" ON stakeholders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all stakeholders" ON stakeholders FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all stakeholders" ON stakeholders FOR DELETE USING (true);

CREATE POLICY "Enable read access for all communication_plans" ON communication_plans FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all communication_plans" ON communication_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all communication_plans" ON communication_plans FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all communication_plans" ON communication_plans FOR DELETE USING (true);

CREATE POLICY "Enable read access for all communication_matrix" ON communication_matrix FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all communication_matrix" ON communication_matrix FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all communication_matrix" ON communication_matrix FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all communication_matrix" ON communication_matrix FOR DELETE USING (true);