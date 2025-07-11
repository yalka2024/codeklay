'use client';

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Wand2, FolderTree, Rocket } from "lucide-react"
import { useI18n } from '../app/i18n'

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
]

const frameworks = {
  javascript: ["React", "Vue.js", "Angular", "Express.js", "Node.js"],
  typescript: ["Next.js", "React", "Angular", "NestJS", "Express.js"],
  python: ["Django", "FastAPI", "Flask", "Streamlit", "Pandas"],
  java: ["Spring Boot", "Spring MVC", "Hibernate"],
  csharp: [".NET Core", "ASP.NET", "Blazor"],
  go: ["Gin", "Echo", "Fiber"],
  rust: ["Actix", "Rocket", "Warp"],
}

const projectTemplates = [
  {
    name: "Web Application",
    description: "Full-stack web app with frontend and backend",
    icon: "🌐",
    features: ["Authentication", "Database", "API", "Responsive UI"],
  },
  {
    name: "API Service",
    description: "RESTful API with database integration",
    icon: "🔌",
    features: ["REST API", "Database", "Authentication", "Documentation"],
  },
  {
    name: "Data Analysis",
    description: "Data processing and visualization project",
    icon: "📊",
    features: ["Data Processing", "Visualization", "Jupyter Notebooks", "Reports"],
  },
  {
    name: "Mobile App",
    description: "Cross-platform mobile application",
    icon: "📱",
    features: ["Cross-platform", "Native Performance", "Push Notifications", "Offline Support"],
  },
]

export function ProjectCreation() {
  const { t } = useI18n()
  const [projectName, setProjectName] = React.useState("")
  const [selectedLanguage, setSelectedLanguage] = React.useState("")
  const [selectedFramework, setSelectedFramework] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [selectedTemplate, setSelectedTemplate] = React.useState("")
  const [includeTests, setIncludeTests] = React.useState(true)
  const [includeDocker, setIncludeDocker] = React.useState(false)
  const [includeCI, setIncludeCI] = React.useState(false)

  const availableFrameworks = selectedLanguage ? frameworks[selectedLanguage as keyof typeof frameworks] || [] : []

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('create_project')}</h1>
        <p className="text-muted-foreground">{t('project_description')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                {t('project_details')}
              </CardTitle>
              <CardDescription>{t('basic_information_about_your_project')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">{t('project_name')}</Label>
                <Input
                  id="project-name"
                  placeholder={t('project_creation.project_name_placeholder')}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">{t('programming_language')}</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('project_creation.select_language_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="framework">{t('framework')}</Label>
                  <Select value={selectedFramework} onValueChange={setSelectedFramework} disabled={!selectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('project_creation.select_framework_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFrameworks.map((framework) => (
                        <SelectItem key={framework} value={framework.toLowerCase()}>
                          {framework}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                {t('ai_instructions')}
              </CardTitle>
              <CardDescription>{t('describe_what_you_want_to_build_in_natural_language')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="ai-instructions"
                placeholder={t('project_creation.ai_instructions_placeholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card>
            <CardHeader>
              <CardTitle>{t('additional_options')}</CardTitle>
              <CardDescription>{t('configure_additional_project_features')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="tests" checked={includeTests} onCheckedChange={(checked) => setIncludeTests(checked === true)} />
                <Label htmlFor="tests">{t('include_unit_tests_and_testing_setup')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="docker" checked={includeDocker} onCheckedChange={(checked) => setIncludeDocker(checked === true)} />
                <Label htmlFor="docker">{t('include_docker_configuration')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="ci" checked={includeCI} onCheckedChange={(checked) => setIncludeCI(checked === true)} />
                <Label htmlFor="ci">{t('include_ci_cd_pipeline_setup')}</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Templates */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('project_templates')}</CardTitle>
              <CardDescription>{t('choose_a_template_to_get_started_quickly')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {projectTemplates.map((template) => (
                <div
                  key={template.name}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTemplate === template.name
                      ? "border-teal-500 bg-teal-500/10"
                      : "border-border hover:border-teal-500/50"
                  }`}
                  onClick={() => setSelectedTemplate(template.name)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature) => (
                          <span key={feature} className="text-xs px-2 py-1 bg-muted rounded-md">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            className="w-full bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700"
            size="lg"
            disabled={!projectName || !selectedLanguage}
          >
            <Rocket className="mr-2 h-4 w-4" />
            {t('generate_project')}
          </Button>
        </div>
      </div>
    </div>
  )
}
