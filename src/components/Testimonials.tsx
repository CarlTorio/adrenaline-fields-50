import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ReviewForm from './ReviewForm';
import AllReviews from './AllReviews';
import RatingStats from './RatingStats';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setReviews(data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
            WHAT OUR <span className="text-accent">CUSTOMERS</span> SAY
          </h2>
          <p className="font-military text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - see what our customers say about their paintball adventures
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Testimonials Side */}
          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-card rounded-lg p-8 border border-border">
                  <h3 className="font-display font-bold text-xl mb-2">No Reviews Yet</h3>
                  <p className="font-military text-muted-foreground mb-4">
                    Be the first to share your paintball experience!
                  </p>
                  <ReviewForm />
                </div>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-card rounded-lg p-6 shadow-tactical hover:shadow-elevated transition-all duration-300 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-display font-bold text-lg text-card-foreground">
                        {review.customer_name}
                      </h4>
                    </div>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-accent fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-accent/20" />
                    <p className="font-military text-muted-foreground leading-relaxed pl-6">
                      {review.review_text}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Action Buttons - Only show if there are reviews */}
            {reviews.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ReviewForm />
                <AllReviews />
              </div>
            )}

            {/* No Ratings Yet Card - Show below reviews when no reviews exist */}
            {reviews.length === 0 && (
              <div className="bg-card rounded-lg p-6 border border-border text-center">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg mb-2">No Ratings Yet</h3>
                <p className="font-military text-muted-foreground text-sm">
                  Be the first to rate our paintball experience!
                </p>
              </div>
            )}

            {/* Rating Stats */}
            <RatingStats />
          </div>

          {/* Image & Stats Side */}
          <div className="space-y-8">
            {/* Hero Image */}
            <div className="relative overflow-hidden rounded-lg shadow-elevated">
              <img src="https://i.imgur.com/47xf6ut.png" alt="Team celebrating paintball victory" className="w-full h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-display font-bold text-xl mb-2">Victory Celebrations</h3>
                <p className="font-military text-white/90">Every game ends with memorable moments</p>
              </div>
            </div>

            {/* Review Platform Links */}
            <div className="bg-gradient-tactical rounded-lg p-6 text-center">
              <h3 className="font-display font-bold text-xl text-primary-foreground mb-4">
                Read More Reviews
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <div className="bg-primary-foreground/10 rounded px-4 py-2 border border-primary-foreground/20">
                  <span className="font-military text-primary-foreground text-sm">Trustpilot • Google • Facebook</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;