
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface RulesPageProps {
  procedureType: 'UNA-USA' | 'Indian Parliamentary' | null;
  onBack: () => void;
}

const RulesPage = ({ procedureType, onBack }: RulesPageProps) => {
  const unaUsaRules = [
    {
      id: 'agenda',
      title: 'Motion to Set Agenda',
      content: 'A motion to set the agenda determines the order in which topics will be discussed. Requires a simple majority to pass. The delegate making the motion must specify the agenda item and may speak for 30 seconds in favor.'
    },
    {
      id: 'moderated',
      title: 'Moderated Caucus',
      content: 'A structured discussion where delegates speak in order, moderated by the chair. The motion must specify topic, total time, and speaking time per delegate. Requires simple majority to pass.'
    },
    {
      id: 'unmoderated',
      title: 'Unmoderated Caucus',
      content: 'An informal discussion period where delegates may move freely and discuss among themselves. The motion must specify total time. Requires simple majority to pass.'
    },
    {
      id: 'rollcall',
      title: 'Roll Call Voting',
      content: 'Each delegation is called individually to cast their vote as "Yes," "No," or "Abstain." Used for substantive matters and when specifically requested.'
    },
    {
      id: 'poi',
      title: 'Points of Information (POI)',
      content: 'Questions directed to the speaker during their speech. The speaker may accept or decline. POIs should be brief, relevant questions, not statements or arguments.'
    }
  ];

  const indianParliamentaryRules = [
    {
      id: 'speaker-list',
      title: 'Speaker List & Whip Orders',
      content: 'The Speaker maintains a list of members wishing to speak. Whips from each party may request speaking time for their members. Priority given based on party strength and topic relevance.'
    },
    {
      id: 'yielding',
      title: 'Yielding Time',
      content: 'A member may yield their remaining speaking time to another member of the same party or to questions from the house. Time cannot be yielded to opposition parties directly.'
    },
    {
      id: 'motion-formats',
      title: 'Indian Motion Formats',
      content: 'Various motion types including: Calling Attention Motion, Adjournment Motion, No-Confidence Motion, and Cut Motions. Each has specific procedures and voting requirements.'
    },
    {
      id: 'question-hour',
      title: 'Question Hour',
      content: 'The first hour of sitting dedicated to questions. Members may ask starred questions (oral answers) or unstarred questions (written answers). Supplementary questions allowed for starred questions.'
    },
    {
      id: 'division',
      title: 'Division of House',
      content: 'When a voice vote is inconclusive, the Speaker may order a division. Members supporting the motion move to the right side of the house, those opposing to the left.'
    }
  ];

  const currentRules = procedureType === 'UNA-USA' ? unaUsaRules : indianParliamentaryRules;
  const currentTitle = procedureType === 'UNA-USA' ? 'UNA-USA Rules of Procedure' : 'Indian Parliamentary Procedure';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📘 {currentTitle}</h1>
          <p className="text-gray-600 mt-2">Detailed rules and procedures</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span>Rules Reference</span>
          </CardTitle>
          <Badge className={procedureType === 'UNA-USA' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}>
            {procedureType}
          </Badge>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {currentRules.map((rule) => (
              <AccordionItem key={rule.id} value={rule.id}>
                <AccordionTrigger className="text-left">{rule.title}</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {rule.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {procedureType === 'UNA-USA' && (
        <Card className="card-shadow bg-blue-50">
          <CardHeader>
            <CardTitle>Additional UNA-USA Procedures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600"><strong>Quorum:</strong> Simple majority of members present and voting</p>
            <p className="text-sm text-gray-600"><strong>Amendments:</strong> Must be submitted in writing and be germane to the clause</p>
            <p className="text-sm text-gray-600"><strong>Right of Reply:</strong> When a delegate feels their country has been misrepresented</p>
          </CardContent>
        </Card>
      )}

      {procedureType === 'Indian Parliamentary' && (
        <Card className="card-shadow bg-orange-50">
          <CardHeader>
            <CardTitle>Indian Parliamentary Specifics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600"><strong>Quorum:</strong> One-tenth of total membership</p>
            <p className="text-sm text-gray-600"><strong>Closure Motion:</strong> To end debate on a topic</p>
            <p className="text-sm text-gray-600"><strong>Privilege Motion:</strong> Breach of privilege or contempt of house</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RulesPage;
