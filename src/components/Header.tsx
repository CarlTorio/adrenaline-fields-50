import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Menu, X } from 'lucide-react';
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigation = [{
    name: 'Home',
    href: '#'
  }, {
    name: 'Locations',
    href: '#locations'
  }, {
    name: 'Events',
    href: '#events'
  }, {
    name: 'Booking',
    href: '#booking'
  }, {
    name: 'About',
    href: '#about'
  }, {
    name: 'Contact',
    href: '#contact'
  }];
  return <header className="sticky top-0 z-50 bg-background/40 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="https://i.imgur.com/AFAnlxO.png" alt="Paintball Adventure Logo" className="h-10 rounded-lg object-contain" />
            <div className="hidden sm:block">
              
              
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map(item => <a key={item.name} href={item.href} className="text-foreground hover:text-accent font-military font-medium transition-colors duration-200 hover:scale-105 transform">
                {item.name}
              </a>)}
          </nav>

          {/* Contact & CTA */}
          <div className="flex items-center space-x-4">
            
            <Button variant="hero" size="default" className="hidden sm:inline-flex">
              Book Now
            </Button>
            
            {/* Mobile menu button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-foreground hover:text-accent transition-colors">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && <div className="lg:hidden py-4 border-t border-border bg-card/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-3">
              {navigation.map(item => <a key={item.name} href={item.href} className="px-3 py-2 text-foreground hover:text-accent font-military font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  {item.name}
                </a>)}
              <div className="flex items-center space-x-2 px-3 py-2 text-primary">
                <Phone size={16} />
                <span className="font-military font-semibold">09555672389</span>
              </div>
              <div className="px-3">
                <Button variant="hero" size="lg" className="w-full">
                  Book Your Adventure
                </Button>
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;