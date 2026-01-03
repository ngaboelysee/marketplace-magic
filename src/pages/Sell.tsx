import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Store, 
  TrendingUp, 
  Shield, 
  CreditCard, 
  Users, 
  ChevronRight,
  Upload,
  Check
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: Users,
    title: "Reach Millions",
    description: "Access our growing customer base of luxury shoppers",
  },
  {
    icon: Shield,
    title: "Seller Protection",
    description: "Secure transactions and dispute resolution support",
  },
  {
    icon: CreditCard,
    title: "Fast Payouts",
    description: "Receive payments directly to your account",
  },
  {
    icon: TrendingUp,
    title: "Growth Tools",
    description: "Analytics and marketing tools to boost your sales",
  },
];

const steps = [
  { number: 1, title: "Business Info", description: "Tell us about your business" },
  { number: 2, title: "Products", description: "Add your first products" },
  { number: 3, title: "Payments", description: "Set up your payment method" },
  { number: 4, title: "Go Live", description: "Launch your store" },
];

export default function Sell() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    description: "",
    category: "",
    website: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-secondary via-background to-secondary py-20">
          <div className="luxe-container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxe-gold/10 text-luxe-gold mb-6">
                <Store className="h-4 w-4" />
                <span className="text-sm font-medium">Start Selling Today</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
                Turn Your Passion Into Profit
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of successful sellers on LUXE Marketplace. 
                Set up your store in minutes and start reaching customers worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="luxe" size="lg" onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}>
                  Start Selling
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Link to="/auth">
                  <Button variant="outline" size="lg">
                    Already have an account? Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 border-b border-border">
          <div className="luxe-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-luxe-gold/10 text-luxe-gold mb-4">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section id="registration" className="py-20">
          <div className="luxe-container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl font-semibold text-foreground mb-2">
                  Register Your Business
                </h2>
                <p className="text-muted-foreground">
                  Complete the steps below to set up your seller account
                </p>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-between mb-12 relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10" />
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-luxe-gold -z-10 transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
                {steps.map((step) => (
                  <div 
                    key={step.number} 
                    className={`flex flex-col items-center cursor-pointer`}
                    onClick={() => setCurrentStep(step.number)}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      step.number <= currentStep 
                        ? "bg-luxe-gold text-primary-foreground" 
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {step.number < currentStep ? <Check className="h-5 w-5" /> : step.number}
                    </div>
                    <span className="text-xs font-medium mt-2 text-foreground hidden sm:block">{step.title}</span>
                    <span className="text-xs text-muted-foreground hidden sm:block">{step.description}</span>
                  </div>
                ))}
              </div>

              {/* Form Content */}
              <div className="bg-card border border-border rounded-2xl p-8">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                      Business Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input
                          id="businessName"
                          name="businessName"
                          placeholder="Your business name"
                          value={formData.businessName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Business Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="hello@yourbusiness.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Business Category *</Label>
                        <select
                          id="category"
                          name="category"
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          value={formData.category}
                          onChange={handleInputChange}
                        >
                          <option value="">Select a category</option>
                          <option value="fashion">Fashion & Apparel</option>
                          <option value="beauty">Beauty & Skincare</option>
                          <option value="home">Home & Living</option>
                          <option value="electronics">Electronics</option>
                          <option value="food">Food & Beverage</option>
                          <option value="jewelry">Jewelry & Accessories</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Business Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Tell us about your business, what you sell, and what makes you unique..."
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website (optional)</Label>
                      <Input
                        id="website"
                        name="website"
                        placeholder="https://yourbusiness.com"
                        value={formData.website}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                      Add Your First Product
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="productName">Product Name *</Label>
                        <Input id="productName" placeholder="e.g., Handcrafted Leather Bag" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price *</Label>
                        <Input id="price" type="number" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productDescription">Product Description *</Label>
                      <Textarea
                        id="productDescription"
                        placeholder="Describe your product in detail..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Product Images *</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-luxe-gold/50 transition-colors cursor-pointer">
                        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your images here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG up to 10MB. Recommended: 1000x1000px
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="inventory">Inventory Count</Label>
                        <Input id="inventory" type="number" placeholder="10" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sku">SKU (optional)</Label>
                        <Input id="sku" placeholder="e.g., LB-001" />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                      Payment Setup
                    </h3>
                    <div className="bg-secondary/50 rounded-lg p-6 mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-[#635BFF] flex items-center justify-center">
                          <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Stripe Connect</h4>
                          <p className="text-sm text-muted-foreground">
                            Secure payment processing powered by Stripe
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect your Stripe account to receive payments directly. 
                        If you don't have one, we'll help you create it.
                      </p>
                      <Button variant="luxe">
                        Connect with Stripe
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Payment Methods You'll Accept:</h4>
                      <div className="flex flex-wrap gap-3">
                        {["Visa", "Mastercard", "American Express", "Apple Pay", "Google Pay"].map((method) => (
                          <span key={method} className="px-3 py-1.5 bg-secondary rounded-lg text-sm text-foreground">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6 text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                      <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-foreground">
                      You're Almost There!
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Review your information and launch your store. 
                      Once live, customers can start discovering your products.
                    </p>
                    <div className="bg-secondary/50 rounded-lg p-6 max-w-md mx-auto text-left">
                      <h4 className="font-medium text-foreground mb-3">Store Summary</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Business Name:</dt>
                          <dd className="font-medium text-foreground">{formData.businessName || "Not set"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Category:</dt>
                          <dd className="font-medium text-foreground">{formData.category || "Not set"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Products:</dt>
                          <dd className="font-medium text-foreground">1 draft</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Payments:</dt>
                          <dd className="font-medium text-foreground">Connected</dd>
                        </div>
                      </dl>
                    </div>
                    <Button variant="luxe" size="lg" className="mt-6">
                      Launch My Store
                    </Button>
                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep < 4 && (
                  <div className="flex justify-between mt-8 pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                      disabled={currentStep === 1}
                    >
                      Back
                    </Button>
                    <Button
                      variant="luxe"
                      onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
