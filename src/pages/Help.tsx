import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HelpCircle, BookOpen, Users, Shield, CreditCard, Mail, Phone } from 'lucide-react';

export default function Help() {
  const [activeTab, setActiveTab] = useState('quick-start');

  const faqs = [
    {
      question: "What are blue carbon credits?",
      answer: "Blue carbon credits represent verified carbon sequestration from coastal and marine ecosystems like mangroves, seagrass meadows, and salt marshes. These ecosystems store carbon at rates up to 10 times higher than terrestrial forests."
    },
    {
      question: "How does the verification process work?",
      answer: "Our rigorous MRV (Monitoring, Reporting, Verification) process includes scientific assessment, third-party verification, and continuous monitoring to ensure all credits meet international standards."
    },
    {
      question: "Can I track my carbon offset impact?",
      answer: "Yes! Your dashboard provides real-time tracking of your carbon credits, CO₂ offset amounts, and impact certificates for all your purchases."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept digital wallet transactions and support various payment methods. All transactions are processed securely and transparently recorded."
    },
    {
      question: "How are project owners verified?",
      answer: "Project owners undergo thorough verification including documentation review, site inspection, and compliance checks with environmental standards."
    },
    {
      question: "What happens if a project fails verification?",
      answer: "Failed projects are not listed on our marketplace. Our verifiers provide detailed feedback to help project owners improve and resubmit their proposals."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="mx-auto w-16 h-16 ocean-gradient rounded-full flex items-center justify-center">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold font-sora">Help Center</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about AquaCreds and blue carbon credits
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
            <TabsTrigger value="roles">Role Guide</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* Quick Start Guide */}
          <TabsContent value="quick-start">
            <div className="space-y-8">
              <Card className="ocean-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Getting Started with AquaCreds</span>
                  </CardTitle>
                  <CardDescription>
                    Follow these simple steps to begin your blue carbon journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Create Your Account</h4>
                        <p className="text-muted-foreground">Sign up and select your role: Project Owner, Credit Buyer, Verifier, or Admin.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Complete Your Profile</h4>
                        <p className="text-muted-foreground">Add your details, wallet information, and verify your identity for secure transactions.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Explore the Marketplace</h4>
                        <p className="text-muted-foreground">Browse verified blue carbon projects and learn about their impact and pricing.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Make Your First Transaction</h4>
                        <p className="text-muted-foreground">Purchase credits or submit a project for verification based on your role.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        5
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Track Your Impact</h4>
                        <p className="text-muted-foreground">Monitor your dashboard for real-time updates on your environmental impact.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Role-based Guidance */}
          <TabsContent value="roles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="text-primary">Project Owner</CardTitle>
                  <CardDescription>For organizations running coastal restoration projects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm font-medium">What you can do:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Register coastal restoration projects</li>
                    <li>• Submit projects for verification</li>
                    <li>• Generate and sell carbon credits</li>
                    <li>• Track project performance and revenue</li>
                    <li>• Receive payments for verified credits</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="text-success">Credit Buyer</CardTitle>
                  <CardDescription>For organizations wanting to offset their carbon footprint</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm font-medium">What you can do:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Browse and purchase verified credits</li>
                    <li>• Track your carbon offset portfolio</li>
                    <li>• Download impact certificates</li>
                    <li>• Monitor your environmental contribution</li>
                    <li>• Manage wallet and transactions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="text-warning">Verifier</CardTitle>
                  <CardDescription>For certified environmental auditors and inspectors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm font-medium">What you can do:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Review project submissions</li>
                    <li>• Conduct site inspections</li>
                    <li>• Approve or reject projects</li>
                    <li>• Maintain verification standards</li>
                    <li>• Update project status</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="text-destructive">Admin</CardTitle>
                  <CardDescription>For platform administrators and system managers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm font-medium">What you can do:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Manage user accounts and permissions</li>
                    <li>• Monitor platform analytics</li>
                    <li>• Oversee compliance and audits</li>
                    <li>• Handle disputes and issues</li>
                    <li>• Configure system settings</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQs */}
          <TabsContent value="faqs">
            <Card className="ocean-shadow">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Common questions about AquaCreds and blue carbon credits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact */}
          <TabsContent value="contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="ocean-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Get in Touch</span>
                  </CardTitle>
                  <CardDescription>
                    Need help? Our support team is here for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-muted-foreground">+91 98765 43210</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-muted-foreground">contact@aquacreds.in</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium mb-2">Business Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                      Saturday: 10:00 AM - 4:00 PM IST<br />
                      Sunday: Closed
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium mb-2">Response Time</h4>
                    <p className="text-sm text-muted-foreground">
                      We typically respond to all inquiries within 24 hours during business days.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="coral-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Community Support</span>
                  </CardTitle>
                  <CardDescription>
                    Connect with other AquaCreds users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    Join our community forums and social media channels to:
                  </p>
                  
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Share best practices and experiences</li>
                    <li>• Get tips from other users</li>
                    <li>• Stay updated on platform features</li>
                    <li>• Participate in sustainability discussions</li>
                  </ul>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium mb-3">Follow Us</h4>
                    <div className="flex space-x-4">
                      <Button variant="outline" size="sm">
                        Twitter
                      </Button>
                      <Button variant="outline" size="sm">
                        LinkedIn
                      </Button>
                      <Button variant="outline" size="sm">
                        Instagram
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}