'use client';

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Search, BookOpen, Plus, MessageCircle, Code, FileText, Star, Clock, Tag } from "lucide-react"
import { useI18n } from '../app/i18n'

const knowledgeItems = [
  {
    id: 1,
    title: "React useEffect Hook Patterns",
    type: "pattern",
    category: "React",
    description: "Common patterns for using useEffect hook effectively",
    content: `// Basic useEffect pattern
useEffect(() => {
  // Side effect logic
  return () => {
    // Cleanup logic
  };
}, [dependencies]);`,
    tags: ["React", "Hooks", "useEffect"],
    createdAt: "2 days ago",
    starred: true,
  },
  {
    id: 2,
    title: "API Error Handling Best Practices",
    type: "tutorial",
    category: "Backend",
    description: "How to properly handle errors in API endpoints",
    content: `// Express.js error handling middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Usage in routes
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});`,
    tags: ["API", "Error Handling", "Express"],
    createdAt: "1 week ago",
    starred: false,
  },
  {
    id: 3,
    title: "CSS Grid Layout Cheat Sheet",
    type: "snippet",
    category: "CSS",
    description: "Quick reference for CSS Grid properties",
    content: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 1rem;
  padding: 1rem;
}

.grid-item {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
}

/* Responsive grid */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}`,
    tags: ["CSS", "Grid", "Layout"],
    createdAt: "3 days ago",
    starred: true,
  },
]

const chatHistory = [
  {
    id: 1,
    question: "How do I implement authentication in Next.js?",
    answer: "For Next.js authentication, I recommend using NextAuth.js. Here's a basic setup...",
    timestamp: "1 hour ago",
  },
  {
    id: 2,
    question: "What's the best way to handle state in React?",
    answer:
      "It depends on your use case. For local component state, use useState. For complex state logic, consider useReducer...",
    timestamp: "2 hours ago",
  },
  {
    id: 3,
    question: "How to optimize database queries?",
    answer:
      "Here are several strategies for database optimization: 1. Use indexes appropriately, 2. Avoid N+1 queries...",
    timestamp: "1 day ago",
  },
]

export function KnowledgeBase() {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [chatInput, setChatInput] = React.useState("")
  const [newSnippetTitle, setNewSnippetTitle] = React.useState("")
  const [newSnippetContent, setNewSnippetContent] = React.useState("")

  const categories = ["all", "React", "Backend", "CSS", "JavaScript", "Python"]

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pattern":
        return <Code className="h-4 w-4" />
      case "tutorial":
        return <BookOpen className="h-4 w-4" />
      case "snippet":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pattern":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "tutorial":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "snippet":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('knowledge_base')}</h1>
          <p className="text-muted-foreground">{t('knowledge_base_description')}</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">{t('browse')}</TabsTrigger>
          <TabsTrigger value="chat">{t('ai_chat')}</TabsTrigger>
          <TabsTrigger value="add">{t('add_new')}</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search_knowledge_base')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all" ? t('all') : category}
                </Button>
              ))}
            </div>
          </div>

          {/* Knowledge Items */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(item.type)}>
                        {getTypeIcon(item.type)}
                        <span className="ml-1 capitalize">{item.type}</span>
                      </Badge>
                      {item.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs font-mono overflow-x-auto">
                      <code>{item.content.substring(0, 150)}...</code>
                    </pre>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {item.createdAt}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    AI Assistant
                  </CardTitle>
                  <CardDescription>
                    Ask questions about coding patterns, best practices, and get step-by-step guidance
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-4">
                      {chatHistory.map((chat) => (
                        <div key={chat.id} className="space-y-2">
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm font-medium">You:</p>
                            <p className="text-sm">{chat.question}</p>
                          </div>
                          <div className="bg-teal-500/10 p-3 rounded-lg">
                            <p className="text-sm font-medium text-teal-600">CodePal:</p>
                            <p className="text-sm">{chat.answer}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask a coding question..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && setChatInput("")}
                    />
                    <Button onClick={() => setChatInput("")}>{t('send')}</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{t('quick_questions')}</CardTitle>
                  <CardDescription>{t('common_questions')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    "How to optimize React performance?",
                    "Best practices for API design?",
                    "How to handle async operations?",
                    "Database indexing strategies?",
                    "CSS layout techniques?",
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setChatInput(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('add_new_knowledge_entry')}</CardTitle>
              <CardDescription>Save coding patterns, tutorials, or snippets for future reference</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('title')}</label>
                <Input
                  placeholder="e.g., React Custom Hook Pattern"
                  value={newSnippetTitle}
                  onChange={(e) => setNewSnippetTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('content')}</label>
                <Textarea
                  placeholder="Paste your code snippet, pattern, or write a tutorial..."
                  value={newSnippetContent}
                  onChange={(e) => setNewSnippetContent(e.target.value)}
                  className="min-h-[300px] font-mono"
                />
              </div>
              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
                  Save Entry
                </Button>
                <Button variant="outline">Save & Generate Tags</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
