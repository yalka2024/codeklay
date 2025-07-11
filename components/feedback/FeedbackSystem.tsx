import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle, Bug, Lightbulb, Send, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface FeedbackData {
  id: string;
  type: 'bug' | 'feature' | 'general' | 'performance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  userAgent: string;
  url: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  status: 'pending' | 'reviewed' | 'in-progress' | 'resolved';
  metadata: {
    browser: string;
    os: string;
    screenSize: string;
    performance: {
      loadTime: number;
      memoryUsage: number;
      errors: string[];
    };
  };
}

const FeedbackSystem: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general' | 'performance'>('general');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuickFeedback, setShowQuickFeedback] = useState(false);

  // Performance monitoring
  const [performanceData, setPerformanceData] = useState({
    loadTime: 0,
    memoryUsage: 0,
    errors: [] as string[],
  });

  useEffect(() => {
    // Collect performance data
    const collectPerformanceData = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const memory = (performance as any).memory;
      
      setPerformanceData({
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        memoryUsage: memory ? memory.usedJSHeapSize : 0,
        errors: window.errors || [],
      });
    };

    // Error tracking
    window.addEventListener('error', (event) => {
      window.errors = window.errors || [];
      window.errors.push(`${event.message} at ${event.filename}:${event.lineno}`);
    });

    collectPerformanceData();
  }, []);

  const submitFeedback = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData: FeedbackData = {
        id: crypto.randomUUID(),
        type: feedbackType,
        priority,
        title: title.trim(),
        description: description.trim(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userId: user?.id,
        userEmail: user?.email,
        status: 'pending',
        metadata: {
          browser: getBrowserInfo(),
          os: getOSInfo(),
          screenSize: `${window.innerWidth}x${window.innerHeight}`,
          performance: performanceData,
        },
      };

      // Send to feedback API
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        toast.success('Feedback submitted successfully!');
        setIsOpen(false);
        resetForm();
        
        // Track feedback submission
        if (window.gtag) {
          window.gtag('event', 'feedback_submitted', {
            feedback_type: feedbackType,
            priority: priority,
          });
        }
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFeedbackType('general');
    setPriority('medium');
    setTitle('');
    setDescription('');
  };

  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getOSInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  };

  const QuickFeedbackButton: React.FC<{ type: 'positive' | 'negative' }> = ({ type }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        setShowQuickFeedback(true);
        setFeedbackType(type === 'positive' ? 'feature' : 'bug');
        setPriority(type === 'positive' ? 'low' : 'high');
        setTitle(type === 'positive' ? 'Positive Experience' : 'Issue Report');
      }}
      className="flex items-center gap-2"
    >
      {type === 'positive' ? <Star className="w-4 h-4" /> : <Bug className="w-4 h-4" />}
      {type === 'positive' ? 'Great!' : 'Report Issue'}
    </Button>
  );

  return (
    <>
      {/* Floating Feedback Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Share Your Feedback
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Quick Feedback */}
              {showQuickFeedback && (
                <div className="flex gap-2">
                  <QuickFeedbackButton type="positive" />
                  <QuickFeedbackButton type="negative" />
                </div>
              )}

              {/* Feedback Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Feedback Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'bug', icon: Bug, label: 'Bug Report', color: 'bg-red-100 text-red-700' },
                    { type: 'feature', icon: Lightbulb, label: 'Feature Request', color: 'bg-blue-100 text-blue-700' },
                    { type: 'general', icon: MessageCircle, label: 'General', color: 'bg-gray-100 text-gray-700' },
                    { type: 'performance', icon: Star, label: 'Performance', color: 'bg-green-100 text-green-700' },
                  ].map(({ type, icon: Icon, label, color }) => (
                    <Button
                      key={type}
                      variant={feedbackType === type ? 'default' : 'outline'}
                      onClick={() => setFeedbackType(type as any)}
                      className={`justify-start ${feedbackType === type ? color : ''}`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Priority Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <div className="flex gap-2">
                  {[
                    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700' },
                    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
                    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
                    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700' },
                  ].map(({ value, label, color }) => (
                    <Button
                      key={value}
                      variant={priority === value ? 'default' : 'outline'}
                      onClick={() => setPriority(value as any)}
                      className={`${priority === value ? color : ''}`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief description of your feedback"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={100}
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide detailed information about your feedback..."
                  className="min-h-[120px]"
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 text-right">
                  {description.length}/1000 characters
                </div>
              </div>

              {/* Performance Data (Auto-collected) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">System Information (Auto-collected)</label>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Browser: {getBrowserInfo()}</div>
                  <div>OS: {getOSInfo()}</div>
                  <div>Screen: {window.innerWidth}x{window.innerHeight}</div>
                  <div>Load Time: {performanceData.loadTime.toFixed(2)}ms</div>
                  {performanceData.errors.length > 0 && (
                    <div>Errors: {performanceData.errors.length} detected</div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitFeedback}
                  disabled={isSubmitting || !title.trim() || !description.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Feedback Prompts */}
      <div className="fixed bottom-20 right-4 z-40 space-y-2">
        <QuickFeedbackButton type="positive" />
        <QuickFeedbackButton type="negative" />
      </div>
    </>
  );
};

export default FeedbackSystem; 