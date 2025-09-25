import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Waves, Target, Eye, TrendingUp, Shield, Users, ArrowRight } from 'lucide-react';

export default function About() {
  useEffect(() => {
    // Add fade-in animation to elements
    const elements = document.querySelectorAll('.animate-fade-in');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('opacity-100');
      }, index * 200);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in opacity-0">
            <Waves className="h-16 w-16 mx-auto mb-6 text-aqua-mint" />
            <h1 className="text-4xl md:text-5xl font-bold font-sora mb-6">
              About AquaCreds
            </h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing coastal conservation through transparent, verified blue carbon credits that turn environmental protection into measurable climate impact.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <Card className="hover-lift ocean-shadow animate-fade-in opacity-0">
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 ocean-gradient rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-sora mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To create a transparent, trustworthy platform that connects coastal restoration projects with climate-conscious organizations and individuals, enabling measurable ocean healing while generating verified carbon credits that fund further conservation efforts.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="hover-lift ocean-shadow animate-fade-in opacity-0">
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 coral-gradient rounded-full flex items-center justify-center">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-sora mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A world where coastal ecosystems are thriving, protected, and valued for their critical role in climate regulation. We envision vibrant blue carbon markets that make conservation financially sustainable and environmentally impactful.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-12 animate-fade-in opacity-0">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-sora mb-4">Our Impact</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Together, we're creating measurable change for our planet's coastal ecosystems
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Card className="hover-lift text-center p-8">
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-primary animate-count-up">18,500+</div>
                  <p className="text-muted-foreground">Credits Verified</p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift text-center p-8">
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-success animate-count-up">37,000</div>
                  <p className="text-muted-foreground">Tons CO₂ Offset</p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift text-center p-8">
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-coral-accent animate-count-up">23</div>
                  <p className="text-muted-foreground">Active Projects</p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift text-center p-8">
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-ocean-blue animate-count-up">147</div>
                  <p className="text-muted-foreground">Partners</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-12">
            <div className="animate-fade-in opacity-0">
              <h2 className="text-3xl md:text-4xl font-bold font-sora mb-4">What We Do</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We provide end-to-end solutions for blue carbon credit verification, trading, and impact tracking
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover-lift ocean-shadow animate-fade-in opacity-0">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto ocean-gradient rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Rigorous Verification</h3>
                  <p className="text-muted-foreground">
                    Every project undergoes comprehensive MRV (Monitoring, Reporting, Verification) processes using international standards and scientific methodologies.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift coral-shadow animate-fade-in opacity-0">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto coral-gradient rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Transparent Trading</h3>
                  <p className="text-muted-foreground">
                    Our marketplace provides real-time tracking, transparent pricing, and complete audit trails for all carbon credit transactions.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift ocean-shadow animate-fade-in opacity-0">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto ocean-gradient rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Community Impact</h3>
                  <p className="text-muted-foreground">
                    We connect local communities, conservation organizations, and businesses to create sustainable funding for coastal protection.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Blue Carbon Importance */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in opacity-0">
              <img
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Blue carbon ecosystem"
                className="rounded-2xl ocean-shadow w-full h-96 object-cover"
              />
            </div>
            
            <div className="space-y-6 animate-fade-in opacity-0">
              <h2 className="text-3xl md:text-4xl font-bold font-sora">
                Why Blue Carbon Matters
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Superior Carbon Storage</h4>
                    <p className="text-muted-foreground">Blue carbon ecosystems store carbon at rates up to 10 times higher than terrestrial forests.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Coastal Protection</h4>
                    <p className="text-muted-foreground">These ecosystems provide natural barriers against storms, erosion, and sea-level rise.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-coral-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Waves className="h-4 w-4 text-coral-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Biodiversity Hotspots</h4>
                    <p className="text-muted-foreground">Support rich marine biodiversity and serve as nurseries for countless species.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in opacity-0 space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold font-sora">
              Join Our Mission
            </h2>
            <p className="text-xl text-muted-foreground">
              Whether you're a project owner, credit buyer, or verifier, there's a place for you in the blue carbon revolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" className="btn-ocean px-8 py-6 text-lg font-semibold">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold">
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}