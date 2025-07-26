import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Building, PartyPopper, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Services = () => {
  const navigate = useNavigate();
  const [allFeaturesExpanded, setAllFeaturesExpanded] = useState(false);

  const toggleAllFeatures = () => {
    setAllFeaturesExpanded(prev => !prev);
  };
  const services = [{
    icon: PartyPopper,
    title: "Team Building",
    description: "Enhance collaboration and communication through strategic paintball challenges designed to strengthen team bonds.",
    features: ["Leadership development", "Team communication", "Strategic planning", "Corporate packages"],
    color: "text-accent"
  }, {
    icon: Building,
    title: "Birthday Party",
    description: "Celebrate special moments with exciting paintball adventures that create unforgettable birthday memories.",
    features: ["Age-appropriate games", "Safety first approach", "Birthday packages", "Party planning"],
    color: "text-primary"
  }, {
    icon: Heart,
    title: "Reunions",
    description: "Bring old friends and family together with exciting paintball experiences perfect for reunion gatherings.",
    features: ["Group activities", "Nostalgia games", "Reunion packages", "Multi-generational fun"],
    color: "text-accent-glow"
  }, {
    icon: Users,
    title: "And many more",
    description: "Custom paintball experiences tailored to any occasion or group size you can imagine.",
    features: ["Custom events", "Flexible options", "Any occasion", "Personalized service"],
    color: "text-primary-glow"
  }];
  return <section id="events" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
            PAINTBALL <span className="text-accent">EXPERIENCES</span>
          </h2>
          <p className="font-military text-xl text-muted-foreground max-w-2xl mx-auto">
            Whatever the occasion, we deliver adrenaline-packed adventures tailored to your group
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {services.map((service, index) => {
          const IconComponent = service.icon;
            return <div key={index} className="group bg-card rounded-lg p-6 shadow-tactical hover:shadow-elevated transition-all duration-300 transform hover:scale-105 border border-border flex flex-col lg:h-full">
                
                
                <h3 className="font-display font-bold text-xl text-card-foreground mb-3">
                  {service.title}
                </h3>
                
                <p className="font-military text-muted-foreground mb-4 leading-relaxed text-sm md:text-base flex-grow">
                  {service.description}
                </p>
                
                <div className="mb-4">
                  <button 
                    onClick={toggleAllFeatures}
                    className="flex flex-col items-center w-full text-center font-military text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>Features</span>
                    <div className="mt-1">
                      {allFeaturesExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                  
                  {allFeaturesExpanded && (
                    <ul className="space-y-2 mt-3">
                      {service.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-center text-sm font-military">
                          <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>)}
                    </ul>
                  )}
                </div>
                
                <Button variant="tactical" size="sm" className="w-full mt-auto" onClick={() => navigate('/booking')}>
                  Book Now
                </Button>
              </div>;
        })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-tactical rounded-lg p-8 text-center">
          <h3 className="font-display font-bold text-2xl text-primary-foreground mb-4">
            Ready to Plan Your Perfect Event?
          </h3>
          <p className="font-military text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            Our expert team will help you design the ultimate paintball experience for your group
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={() => navigate('/booking')}>
              Book Your Session
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <a href="tel:09555672389">Call 09555672389</a>
            </Button>
          </div>
        </div>
      </div>

    </section>;
};
export default Services;