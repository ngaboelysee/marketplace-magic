import { Star } from "lucide-react";

const testimonials = [
  {
    content: "LUXE Market transformed my small jewelry business. The platform's elegant design attracts exactly the kind of customers who appreciate handcrafted pieces.",
    author: "Sarah Chen",
    role: "Founder, Luna Jewels",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    content: "The analytics dashboard gives me insights I never had before. I've tripled my sales since joining, and the customer support is exceptional.",
    author: "Marcus Webb",
    role: "Owner, Heritage Goods",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
  {
    content: "As a buyer, I love the curated selection and verified sellers. Every purchase feels premium, and shipping is always fast and secure.",
    author: "Emily Rodriguez",
    role: "LUXE Customer",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
];

export function TestimonialsSection() {
  return (
    <section className="luxe-section bg-background">
      <div className="luxe-container">
        {/* Header */}
        <div className="text-center">
          <h2 className="luxe-heading-lg text-foreground">Loved by Our Community</h2>
          <p className="luxe-text-body mt-2 mx-auto max-w-2xl">
            See what sellers and buyers are saying about LUXE Market
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="relative rounded-2xl bg-secondary/50 p-8 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-luxe-gold text-luxe-gold" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mt-4 text-foreground leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
