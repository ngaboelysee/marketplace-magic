import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export default function Contact() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Check your input", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not send", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Message sent", description: "We'll be in touch shortly." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="luxe-container py-16 lg:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm uppercase tracking-widest text-luxe-gold mb-4">Get in Touch</p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            We'd love to hear from you
          </h1>
          <p className="text-muted-foreground">
            Questions, partnership ideas, or feedback — drop us a line.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <aside className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-luxe-gold/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-luxe-gold" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Visit us</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    KN 4 Avenue<br />Nyarugenge, Kigali<br />Rwanda
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-luxe-gold/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-luxe-gold" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Email</p>
                  <a href="mailto:luxemarketplace@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    luxemarketplace@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-luxe-gold/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-luxe-gold" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Hours</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mon – Sat · 8:00 – 18:00 (CAT)
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <form onSubmit={onSubmit} className="lg:col-span-3 bg-card border border-border rounded-2xl p-6 lg:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={form.name} maxLength={100}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={form.email} maxLength={255}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={form.subject} maxLength={150}
                onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea id="message" rows={6} value={form.message} maxLength={2000}
                onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <Button type="submit" variant="luxe" size="lg" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</> : "Send Message"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
