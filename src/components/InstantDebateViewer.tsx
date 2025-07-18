import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, User, Bot, Calendar, MessageSquare, Trophy, Download, Share } from 'lucide-react';

interface Message {
  id: string;
  speaker: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface DebateEvaluation {
  score: number;
  breakdown: {
    logical_consistency: number;
    evidence_quality: number;
    rebuttal_effectiveness: number;
    persuasiveness: number;
    rhetorical_skill: number;
  };
  strengths: string[];
  improvements: string[];
  argument_analysis: {
    argument: string;
    feedback: string;
    suggestion: string;
  }[];
  final_remarks: string;
}

interface DebateRecord {
  id: string;
  topic: string;
  userPosition: 'for' | 'against';
  aiPosition: 'for' | 'against';
  messages: Message[];
  createdAt: Date;
  evaluation?: DebateEvaluation;
}

interface InstantDebateViewerProps {
  debate: DebateRecord;
  onBack: () => void;
  onViewEvaluation: () => void;
}

const InstantDebateViewer = ({ debate, onBack, onViewEvaluation }: InstantDebateViewerProps) => {
  const [showEvaluation, setShowEvaluation] = useState(false);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPositionBadge = (position: 'for' | 'against') => {
    return position === 'for' 
      ? { text: 'In Favor', color: 'bg-green-100 text-green-800' }
      : { text: 'Against', color: 'bg-red-100 text-red-800' };
  };

  const exportDebate = () => {
    const transcript = debate.messages.map(msg => 
      `[${formatTime(msg.timestamp)}] ${msg.speaker.toUpperCase()}: ${msg.text}`
    ).join('\n\n');

    const content = `INSTANT DEBATE TRANSCRIPT
================================

Topic: ${debate.topic}
Date: ${formatDate(debate.createdAt)}
Your Position: ${debate.userPosition.toUpperCase()}
AI Position: ${debate.aiPosition.toUpperCase()}

TRANSCRIPT:
${transcript}

${debate.evaluation ? `
EVALUATION:
Score: ${debate.evaluation.score}/100

STRENGTHS:
${debate.evaluation.strengths.map(s => `• ${s}`).join('\n')}

IMPROVEMENTS:
${debate.evaluation.improvements.map(i => `• ${i}`).join('\n')}

FINAL REMARKS:
${debate.evaluation.final_remarks}
` : ''}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debate-${debate.topic.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareDebate = async () => {
    const text = `Just completed a debate on "${debate.topic}" and scored ${debate.evaluation?.score || 'N/A'}/100! 🎯`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Debate Performance',
          text: text,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(text);
        alert('Debate summary copied to clipboard!');
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(text);
      alert('Debate summary copied to clipboard!');
    }
  };

  const userPositionBadge = getPositionBadge(debate.userPosition);
  const aiPositionBadge = getPositionBadge(debate.aiPosition);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Debate Viewer</h1>
          <p className="text-gray-600 mt-2">{formatDate(debate.createdAt)}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={exportDebate}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={shareDebate}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Debate Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{debate.topic}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Your Position:</span>
                <Badge className={userPositionBadge.color}>
                  {userPositionBadge.text}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-red-600" />
                <span className="font-medium">AI Position:</span>
                <Badge className={aiPositionBadge.color}>
                  {aiPositionBadge.text}
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <span className="font-medium">Total Messages:</span>
                <span>{debate.messages.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Duration:</span>
                <span>
                  {Math.round((debate.messages[debate.messages.length - 1]?.timestamp.getTime() - debate.messages[0]?.timestamp.getTime()) / 60000)} minutes
                </span>
              </div>
            </div>
          </div>
          
          {debate.evaluation && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">Performance Score:</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {debate.evaluation.score}/100
                  </Badge>
                </div>
                <Button variant="outline" onClick={() => setShowEvaluation(!showEvaluation)}>
                  {showEvaluation ? 'Hide' : 'Show'} Evaluation
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evaluation (if shown) */}
      {showEvaluation && debate.evaluation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <span>Performance Evaluation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Strengths:</h4>
                <ul className="space-y-1">
                  {debate.evaluation.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-700">• {strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-600 mb-2">Areas for Improvement:</h4>
                <ul className="space-y-1">
                  {debate.evaluation.improvements.map((improvement, index) => (
                    <li key={index} className="text-sm text-gray-700">• {improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t">
              <h4 className="font-semibold text-gray-900 mb-2">Final Remarks:</h4>
              <p className="text-gray-700">{debate.evaluation.final_remarks}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debate Transcript */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <span>Debate Transcript</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full rounded-md border p-4">
            <div className="space-y-4">
              {debate.messages.map((message, index) => (
                <div key={message.id || index} className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl p-4 rounded-lg ${
                    message.speaker === 'user' 
                      ? 'bg-blue-500 text-white ml-12' 
                      : 'bg-gray-100 text-gray-900 mr-12'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {message.speaker === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {message.speaker === 'user' ? 'You' : 'AI'}
                      </span>
                      <span className={`text-xs ${message.speaker === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstantDebateViewer;
