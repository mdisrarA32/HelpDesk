import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Ticket, Shield, Clock, Users, Sparkles, BarChart3, Star, Zap, CheckCircle2, Calendar
} from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-28 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-2xl">
              <Ticket className="h-10 w-10 text-white" />
            </div>
          </div>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight sm:text-6xl">
            Empower Your
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}HelpDesk{" "}
            </span>
            Experience
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-10 text-lg text-gray-300"
          >
            Simplify ticket management, boost collaboration, and never miss a deadline — all from one intelligent dashboard.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-indigo-500/30"
            >
              🚀 Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="border-white/20 text-white hover:bg-white/10"
            >
              🔐 Sign In
            </Button>
          </div>

          {/* Hero Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
            {[
              { value: "10K+", label: "Tickets Resolved" },
              { value: "500+", label: "Active Agents" },
              { value: "95%", label: "Customer Satisfaction" },
              { value: "200+", label: "Enterprise Clients" },
            ].map((stat, idx) => (
              <motion.div key={idx} whileHover={{ scale: 1.05 }} className="rounded-2xl bg-white/5 p-6 backdrop-blur-md shadow-md">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="mt-2 text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-center text-4xl font-bold mb-12">Powerful Features</h2>
        <motion.div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Shield className="h-7 w-7 text-indigo-400" />, title: "Role-Based Access", desc: "Manage users, agents, and admins securely with customized roles and permissions." },
            { icon: <Clock className="h-7 w-7 text-yellow-400" />, title: "SLA Tracking", desc: "Monitor deadlines and receive alerts before breaches occur — stay on top of support goals." },
            { icon: <Users className="h-7 w-7 text-green-400" />, title: "Team Collaboration", desc: "Enable comments, assignments, and status updates to keep your team aligned." },
            { icon: <BarChart3 className="h-7 w-7 text-pink-400" />, title: "Advanced Analytics", desc: "Track performance metrics, ticket trends, and agent productivity with intuitive charts." },
            { icon: <Sparkles className="h-7 w-7 text-purple-400" />, title: "Customizable Dashboard", desc: "Arrange your workflow the way you want with widgets and filters." },
            { icon: <Zap className="h-7 w-7 text-blue-400" />, title: "Automated Workflows", desc: "Set automation rules to route tickets and send notifications efficiently." },
            { icon: <CheckCircle2 className="h-7 w-7 text-green-400" />, title: "Ticket Prioritization", desc: "Mark urgent tickets and manage backlog smartly." },
            { icon: <Calendar className="h-7 w-7 text-yellow-400" />, title: "Deadline Reminders", desc: "Get automatic reminders for approaching SLA deadlines." },
          ].map((feature, idx) => (
            <motion.div key={idx} whileHover={{ y: -8 }} className="rounded-2xl bg-white/5 p-8 border border-white/10 backdrop-blur-md shadow-lg transition-all">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">{feature.icon}</div>
              <h3 className="mb-2 text-2xl font-semibold text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-center text-4xl font-bold mb-12">What Our Clients Say</h2>
        <motion.div className="grid gap-8 md:grid-cols-3">
          {[
            { name: "Aman Sharma", role: "Support Lead", feedback: "HelpDesk transformed our support workflow. Tickets are resolved faster and our team is more organized." },
            { name: "Neha Kapoor", role: "Customer Success Manager", feedback: "Intuitive interface and real-time updates make managing support effortless." },
            { name: "Rohit Verma", role: "Operations Head", feedback: "SLA tracking and analytics helped us improve customer satisfaction significantly." },
          ].map((client, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.03 }} className="rounded-2xl bg-white/5 p-6 backdrop-blur-md shadow-lg">
              <p className="text-gray-300 mb-4">"{client.feedback}"</p>
              <p className="font-semibold text-white">{client.name}</p>
              <p className="text-gray-400 text-sm">{client.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-center text-4xl font-bold mb-12">Pricing Plans</h2>
        <motion.div className="grid gap-8 md:grid-cols-3">
          {[
            { title: "Free", price: "$0", features: ["Up to 10 tickets/mo", "Basic Analytics", "Community Support"], highlight: false },
            { title: "Pro", price: "$29/mo", features: ["Unlimited tickets", "Advanced Analytics", "Priority Support", "Custom Dashboard"], highlight: true },
            { title: "Enterprise", price: "Custom", features: ["All Pro features", "Dedicated Account Manager", "SLA Guarantees", "Custom Integrations"], highlight: false },
          ].map((plan, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.03 }} className={`rounded-2xl p-8 shadow-lg backdrop-blur-md border border-white/10 ${plan.highlight ? "bg-gradient-to-r from-indigo-500/30 to-purple-600/30" : "bg-white/5"}`}>
              <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
              <p className="text-3xl font-extrabold mb-6">{plan.price}</p>
              <ul className="mb-6 text-gray-300 space-y-2">
                {plan.features.map((f, i) => (<li key={i}>• {f}</li>))}
              </ul>
              <Button size="lg" onClick={() => navigate("/register")} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium">
                {plan.highlight ? "Get Pro" : "Choose Plan"}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-center text-4xl font-bold mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: "Can I try HelpDesk for free?", a: "Yes! The Free plan gives you up to 10 tickets per month with basic features." },
            { q: "Does HelpDesk support SLA tracking?", a: "Absolutely! SLA tracking and reminders are available in all paid plans." },
            { q: "Can I upgrade my plan later?", a: "Yes, you can easily upgrade or downgrade your plan anytime from your account settings." },
            { q: "Is my data secure?", a: "We follow industry-standard encryption and security protocols to ensure your data is safe." },
          ].map((faq, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.01 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-md">
              <p className="font-semibold text-white">{faq.q}</p>
              <p className="text-gray-300 mt-2">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-white/10 p-12 backdrop-blur-lg shadow-2xl">
          <Sparkles className="mx-auto mb-4 h-10 w-10 text-purple-400" />
          <h2 className="mb-4 text-4xl font-bold">Stay Updated</h2>
          <p className="mb-8 text-lg text-gray-300">Subscribe to get latest product updates and tips directly to your inbox.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <input type="email" placeholder="Your Email" className="p-3 rounded-lg text-black w-full sm:w-auto" />
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Subscribe</Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-gray-400 text-sm">
        © 2025 HelpDesk with ❤️ by <span className="text-indigo-400 font-medium">MD ISRAR</span> · All Rights Reserved
      </footer>

    </div>
  );
};

export default Index;
