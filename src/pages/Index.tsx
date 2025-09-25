import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowRight, Shield, Waves, TreePine, TrendingUp } from 'lucide-react';
import heroVideo from '@/assets/Blue_Carbon.mp4';
import mangroveBackground from '@/assets/mangrove-hero-bg.jpg';

export default function Index() {
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
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={mangroveBackground}
            alt="Mangrove forest background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in opacity-0">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold font-sora text-white leading-tight">
                  Healing the ocean,<br />
                  <span className="text-aqua-mint">Cleaning the planet</span>
                </h1>
                <p className="text-xl text-gray-200 leading-relaxed max-w-2xl">
                  Verified blue carbon credits powered by transparent MRV—turning coastal restoration into trusted climate impact.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signin">
                  <Button size="lg" className="btn-coral px-8 py-6 text-lg font-semibold">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-lg font-semibold border-white text-blue-400 hover:bg-white hover:text-primary"
                  onClick={() => document.getElementById('what-is-blue-carbon')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Hero Video */}
            <div className="relative animate-fade-in opacity-0">
              <div className="relative z-10 rounded-2xl overflow-hidden border-4 border-white/20 card-shadow">
                <video
                  src={heroVideo}
                  controls
                  controlsList=""
                  loop
                  preload="metadata"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Blue Carbon Credits Section */}
      <section id="what-is-blue-carbon" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <img
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Blue carbon ecosystem"
                className="rounded-2xl ocean-shadow w-full h-96 object-cover"
              />
            </div>
            
            <div className="space-y-6 animate-slide-up">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold font-sora text-foreground">
                  What is Blue Carbon Credit?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Blue carbon credits represent verified carbon sequestration from coastal and marine ecosystems—mangroves, seagrass meadows, and salt marshes. These "blue carbon" ecosystems store carbon at rates up to 10 times higher than terrestrial forests.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our platform ensures every credit is backed by rigorous Monitoring, Reporting, and Verification (MRV) processes, creating trust and transparency in the blue carbon market.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="hover-lift">
                  <CardContent className="p-4 text-center">
                    <TreePine className="h-8 w-8 text-success mx-auto mb-2" />
                    <p className="font-semibold text-sm">10x Higher</p>
                    <p className="text-xs text-muted-foreground">Carbon Storage Rate</p>
                  </CardContent>
                </Card>
                <Card className="hover-lift">
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-semibold text-sm">100% Verified</p>
                    <p className="text-xs text-muted-foreground">Transparent MRV</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-12 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold font-sora text-foreground">
                The Problem
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Coastal ecosystems are disappearing 3-5 times faster than tropical rainforests, while the voluntary carbon market lacks transparency and trust in blue carbon projects.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover-lift text-center p-8">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold">Rapid Loss</h3>
                  <p className="text-muted-foreground">
                    3-5x faster degradation than rainforests threatens critical carbon storage
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift text-center p-8">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-warning/10 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-warning" />
                  </div>
                  <h3 className="text-xl font-semibold">Trust Deficit</h3>
                  <p className="text-muted-foreground">
                    Lack of transparent verification in voluntary carbon markets
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift text-center p-8">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Waves className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Undervalued Impact</h3>
                  <p className="text-muted-foreground">
                    Blue carbon's superior sequestration potential remains untapped
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-12 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold font-sora text-foreground">
                Our Solution
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                AquaCreds ensures a transparent record of verified blue carbon projects, supporting coastal restoration while providing measurable climate impact.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="hover-lift ocean-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto ocean-gradient rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Verified Projects</h3>
                  <p className="text-muted-foreground">
                    Rigorous MRV processes ensure every project meets international standards for blue carbon sequestration.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift coral-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto coral-gradient rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Transparent Trading</h3>
                  <p className="text-muted-foreground">
                    Real-time tracking and verification of carbon credits with complete transparency in transactions.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift ocean-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto ocean-gradient rounded-full flex items-center justify-center">
                    <Waves className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Coastal Impact</h3>
                  <p className="text-muted-foreground">
                    Support restoration of mangroves, seagrass, and coral reefs while earning verified carbon credits.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="pt-8">
              <Link to="/marketplace">
                <Button size="lg" className="btn-ocean px-8 py-6 text-lg font-semibold">
                  Explore Marketplace
                  <ArrowRight className="ml-2 h-5 w-5" />
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