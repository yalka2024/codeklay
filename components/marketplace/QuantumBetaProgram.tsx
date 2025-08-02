import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Users, 
  TrendingUp, 
  Star, 
  MessageSquare, 
  Zap,
  CheckCircle,
  Clock,
  Award,
  BarChart3
} from 'lucide-react';

// Beta Program Interfaces
interface BetaParticipant {
  id: string;
  userId: string;
  email: string;
  name: string;
  joinDate: Date;
  creditsAllocated: number;
  creditsUsed: number;
  feedbackSubmitted: number;
  lastActive: Date;
  status: 'active' | 'inactive' | 'completed';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface UserFeedback {
  id: string;
  userId: string;
  category: 'usability' | 'performance' | 'features' | 'documentation' | 'support';
  rating: number;
  comment: string;
  timestamp: Date;
  resolved: boolean;
}

interface CreditAllocation {
  userId: string;
  credits: number;
  allocationDate: Date;
  expiryDate: Date;
  usage: {
    quantumJobs: number;
    simulations: number;
    totalCost: number;
  };
}

interface BetaProgramMetrics {
  totalParticipants: number;
  activeParticipants: number;
  totalCreditsAllocated: number;
  totalCreditsUsed: number;
  averageRating: number;
  feedbackCount: number;
  featureAdoption: Record<string, number>;
  participantEngagement: number;
}

// Quantum Beta Program Component
export default function QuantumBetaProgram() {
  const [participants, setParticipants] = useState<BetaParticipant[]>([]);
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [metrics, setMetrics] = useState<BetaProgramMetrics | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<BetaParticipant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockParticipants: BetaParticipant[] = [
      {
        id: '1',
        userId: 'user-001',
        email: 'alice@quantum.com',
        name: 'Alice Johnson',
        joinDate: new Date('2025-01-15'),
        creditsAllocated: 100,
        creditsUsed: 45,
        feedbackSubmitted: 3,
        lastActive: new Date(),
        status: 'active',
        tier: 'gold'
      },
      {
        id: '2',
        userId: 'user-002',
        email: 'bob@research.org',
        name: 'Bob Smith',
        joinDate: new Date('2025-01-20'),
        creditsAllocated: 50,
        creditsUsed: 12,
        feedbackSubmitted: 1,
        lastActive: new Date(Date.now() - 86400000), // 1 day ago
        status: 'active',
        tier: 'silver'
      },
      {
        id: '3',
        userId: 'user-003',
        email: 'carol@university.edu',
        name: 'Carol Davis',
        joinDate: new Date('2025-01-10'),
        creditsAllocated: 200,
        creditsUsed: 180,
        feedbackSubmitted: 5,
        lastActive: new Date(),
        status: 'active',
        tier: 'platinum'
      }
    ];

    const mockFeedback: UserFeedback[] = [
      {
        id: '1',
        userId: 'user-001',
        category: 'usability',
        rating: 5,
        comment: 'The natural language interface is amazing! Makes quantum computing accessible.',
        timestamp: new Date('2025-01-25'),
        resolved: false
      },
      {
        id: '2',
        userId: 'user-003',
        category: 'performance',
        rating: 4,
        comment: 'Great performance, but would like faster simulation times for large circuits.',
        timestamp: new Date('2025-01-24'),
        resolved: true
      },
      {
        id: '3',
        userId: 'user-002',
        category: 'features',
        rating: 5,
        comment: 'The hybrid quantum-classical workflows are revolutionary!',
        timestamp: new Date('2025-01-23'),
        resolved: false
      }
    ];

    const mockMetrics: BetaProgramMetrics = {
      totalParticipants: 150,
      activeParticipants: 127,
      totalCreditsAllocated: 15000,
      totalCreditsUsed: 8750,
      averageRating: 4.6,
      feedbackCount: 89,
      featureAdoption: {
        'Natural Language': 95,
        'Hybrid Workflows': 78,
        'VR Visualization': 45,
        'Advanced Algorithms': 82
      },
      participantEngagement: 84.7
    };

    setParticipants(mockParticipants);
    setFeedback(mockFeedback);
    setMetrics(mockMetrics);
  };

  const allocateFreeCredits = async (userId: string, credits: number) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update participant credits
      setParticipants(prev => prev.map(p => 
        p.userId === userId 
          ? { ...p, creditsAllocated: p.creditsAllocated + credits }
          : p
      ));

      console.log(`Allocated ${credits} credits to user ${userId}`);
    } catch (error) {
      console.error('Failed to allocate credits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const collectFeedback = async (feedbackData: Omit<UserFeedback, 'id' | 'timestamp'>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFeedback: UserFeedback = {
        ...feedbackData,
        id: `feedback-${Date.now()}`,
        timestamp: new Date()
      };

      setFeedback(prev => [...prev, newFeedback]);
      
      // Update participant feedback count
      setParticipants(prev => prev.map(p => 
        p.userId === feedbackData.userId 
          ? { ...p, feedbackSubmitted: p.feedbackSubmitted + 1 }
          : p
      ));

      console.log('Feedback collected successfully');
    } catch (error) {
      console.error('Failed to collect feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const manageBetaProgram = async () => {
    // This would generate comprehensive beta program metrics
    const programMetrics = {
      participantEngagement: calculateEngagement(),
      featureAdoption: calculateFeatureAdoption(),
      successMetrics: calculateSuccessMetrics()
    };

    console.log('Beta program metrics:', programMetrics);
    return programMetrics;
  };

  const calculateEngagement = () => {
    const activeUsers = participants.filter(p => p.status === 'active').length;
    const totalUsers = participants.length;
    return totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
  };

  const calculateFeatureAdoption = () => {
    // Mock feature adoption calculation
    return {
      'Natural Language': 95,
      'Hybrid Workflows': 78,
      'VR Visualization': 45,
      'Advanced Algorithms': 82
    };
  };

  const calculateSuccessMetrics = () => {
    const totalCredits = participants.reduce((sum, p) => sum + p.creditsAllocated, 0);
    const usedCredits = participants.reduce((sum, p) => sum + p.creditsUsed, 0);
    const totalFeedback = feedback.length;
    const averageRating = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;

    return {
      creditUtilization: totalCredits > 0 ? (usedCredits / totalCredits) * 100 : 0,
      feedbackRate: participants.length > 0 ? (totalFeedback / participants.length) : 0,
      averageRating: averageRating || 0
    };
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 'bronze': return 'bg-gradient-to-r from-amber-600 to-orange-600';
      default: return 'bg-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-red-600';
      case 'completed': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quantum Computing Beta Program</h1>
          <p className="text-gray-600 mt-2">
            Join our exclusive beta program and get free Azure Quantum credits
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Zap className="w-4 h-4 mr-2" />
          Beta Active
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Program Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalParticipants || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics?.activeParticipants || 0} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credits Allocated</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalCreditsAllocated?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics?.totalCreditsUsed?.toLocaleString() || 0} used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.averageRating?.toFixed(1) || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics?.feedbackCount || 0} reviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.participantEngagement?.toFixed(1) || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  Active participation rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Feature Adoption */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Adoption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.featureAdoption && Object.entries(metrics.featureAdoption).map(([feature, adoption]) => (
                  <div key={feature} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{feature}</span>
                      <span>{adoption}%</span>
                    </div>
                    <Progress value={adoption} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => allocateFreeCredits('new-user', 50)}
                  disabled={isLoading}
                  className="w-full"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Allocate Credits
                </Button>
                <Button 
                  onClick={() => setActiveTab('feedback')}
                  variant="outline"
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View Feedback
                </Button>
                <Button 
                  onClick={() => manageBetaProgram()}
                  variant="outline"
                  className="w-full"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Beta Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participants.map((participant) => (
                  <div 
                    key={participant.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedParticipant(participant)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{participant.name}</span>
                          <Badge className={`${getTierColor(participant.tier)} text-white`}>
                            {participant.tier}
                          </Badge>
                          <span className={`text-sm ${getStatusColor(participant.status)}`}>
                            {participant.status}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{participant.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {participant.creditsUsed}/{participant.creditsAllocated} credits
                        </div>
                        <div className="text-xs text-gray-600">
                          {participant.feedbackSubmitted} feedback
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          allocateFreeCredits(participant.userId, 25);
                        }}
                        disabled={isLoading}
                      >
                        +25 Credits
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{item.category}</Badge>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {item.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{item.comment}</p>
                      </div>
                      <div className="ml-4">
                        {item.resolved ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Credit Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{participant.name}</span>
                        <span>{Math.round((participant.creditsUsed / participant.creditsAllocated) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(participant.creditsUsed / participant.creditsAllocated) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Active Participants</span>
                    <span className="font-medium">{metrics?.activeParticipants || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Feedback per User</span>
                    <span className="font-medium">
                      {metrics && participants.length > 0 
                        ? (metrics.feedbackCount / participants.length).toFixed(1) 
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credit Utilization Rate</span>
                    <span className="font-medium">
                      {metrics && metrics.totalCreditsAllocated > 0
                        ? Math.round((metrics.totalCreditsUsed / metrics.totalCreditsAllocated) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Success Alert */}
      {isLoading && (
        <Alert>
          <AlertDescription>
            Processing your request...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 