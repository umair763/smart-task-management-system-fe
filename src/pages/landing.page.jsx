"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Users,
  Bell,
  FileText,
  BarChart,
  Smartphone,
  ArrowRight,
  Play,
  Star,
  ShieldCheck,
  Globe,
  Clock,
  Lightbulb,
  Menu,
  X,
} from "lucide-react";
import { Footer } from "../components/common";

export const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Lightbulb,
      title: "Intelligent Task Management",
      description:
        "Create tasks with dependencies, subtasks, and priorities. Watch your workflow optimize itself as you work.",
      color: "bg-[#0D9488]/10 text-[#0D9488]",
    },
    // {
    //    icon: Users,
    //    title: 'Real-Time Collaboration',
    //    description: 'See updates instantly. Know what your team is working on without constant check-ins.',
    //    color: 'from-blue-500 to-cyan-500',
    // },
    {
      icon: Bell,
      title: "Smart Reminders & Notifications",
      description:
        "Smart reminders that learn your patterns. Get notified when dependencies are ready.",
      color: "bg-[#EA580C]/10 text-[#EA580C]",
    },
    {
      icon: FileText,
      title: "Rich Context & Attachments",
      description:
        "Add notes, files, images. Everything related to your task lives in one spot.",
      color: "bg-[#0891B2]/10 text-[#0891B2]",
    },
    {
      icon: BarChart,
      title: "Powerful Analytics",
      description:
        "See patterns, track progress, identify bottlenecks. Make data-driven decisions about your time.",
      color: "bg-[#059669]/10 text-[#059669]",
    },
    {
      icon: Smartphone,
      title: "Universal Access",
      description:
        "Beautiful dark/light themes. Works perfectly on phone, tablet, desktop. Always in sync.",
      color: "bg-[#D97706]/10 text-[#D97706]",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Project Manager",
      company: "TechCorp",
      content:
        "Finally, a todo app that thinks like I do. The dependency features alone saved our team 10 hours a week.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Startup Founder",
      company: "InnovateLab",
      content:
        "Switched our entire team from other tools. The real-time updates and smart reminders are game-changers.",
      rating: 5,
    },
    {
      name: "Dr. Amy Thompson",
      role: "Research Director",
      company: "ScienceHub",
      content:
        "Beautiful, intuitive, powerful. It's rare to find all three in one app.",
      rating: 5,
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: [0, 0, 0.2, 1] },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/20/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-[#0D9488] p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#0D9488]">
                SmartTask
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-[#475569] hover:text-[#0D9488] transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-[#475569] hover:text-[#0D9488] transition-colors font-medium"
              >
                Pricing
              </a>
              <a
                href="#security"
                className="text-[#475569] hover:text-[#0D9488] transition-colors font-medium"
              >
                Security
              </a>
              <Link
                to="/login"
                className="text-[#475569] hover:text-[#0D9488] transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="bg-[#EA580C] text-white px-6 py-2 rounded-lg hover:bg-[#C2410C] hover:shadow-lg active:scale-[0.98] transition-all duration-200 font-semibold"
              >
                Get Started Free
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-[#475569] hover:text-[#0D9488] transition-colors font-medium"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-[#475569] hover:text-[#0D9488] transition-colors font-medium"
                >
                  Pricing
                </a>
                <a
                  href="#security"
                  className="text-[#475569] hover:text-[#0D9488] transition-colors font-medium"
                >
                  Security
                </a>
                <Link
                  to="/auth/login"
                  className="text-[#475569] hover:text-[#0D9488] transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-[#EA580C] text-white px-6 py-2 rounded-lg text-center font-semibold hover:bg-[#C2410C] transition-colors"
                >
                  Get Started Free
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-[#0D9488] via-[#0D9488] to-[#0F766E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Transform{" "}
                <span className="text-[#FED7AA]">
                  Chaos
                </span>{" "}
                Into{" "}
                <span className="text-[#CCFBF1]">
                  Clarity
                </span>
              </motion.h1>

              <motion.p
                className="text-lg text-white/85 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                The intelligent task manager that adapts to how you work – from
                simple tasks to complex project workflows with real-time
                collaboration.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link
                  to="/auth/register"
                  className="bg-[#EA580C] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#C2410C] hover:shadow-xl hover:shadow-orange-500/25 active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Start Organizing Smarter</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <button className="border-2 border-white/50 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Watch Demo</span>
                </button>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Smart task dependencies</span>
                </div>
                {/* <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                           <span>Real-time collaboration</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <CheckCircle className="h-5 w-5 text-green-500" />
                           <span>AI-powered insights</span>
                        </div> */}
              </motion.div>
            </motion.div>

            {/* Right Content - Interactive Demo */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-[#E2E8F0]">
                {/* Mock App Interface */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Today's Tasks
                    </h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>

                  {[1, 2, 3, 4].map((item, index) => (
                    <motion.div
                      key={item}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    >
                      <div className="w-4 h-4 border-2 border-[#0D9488] rounded"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2 mt-1"></div>
                      </div>
                      <div className="w-6 h-6 bg-[#CCFBF1] rounded-full"></div>
                    </motion.div>
                  ))}
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-[#0D9488] text-white p-3 rounded-lg shadow-lg shadow-teal-500/30"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bell className="h-5 w-5" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 bg-[#EA580C] text-white p-3 rounded-lg shadow-lg shadow-orange-500/30"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <Users className="h-5 w-5" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-xl text-gray-600  max-w-3xl mx-auto">
              Everything you need to manage tasks, collaborate with teams, and
              boost productivity in one intelligent platform.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                variants={fadeInUp}
                onHoverStart={() => setActiveFeature(index)}
              >
                <div
                  className={`inline-flex p-3 rounded-xl ${feature.color} mb-4`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600  leading-relaxed">
                  {feature.description}
                </p>
                <motion.div className="absolute inset-0 bg-[#0D9488]/4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-[#F8FAFC] to-[#F0FDFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 ">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Brain Dump",
                description:
                  "Add all your tasks effortlessly with our intuitive interface",
                icon: Lightbulb,
              },
              {
                step: "02",
                title: "Connect",
                description:
                  "Link related tasks and set dependencies to optimize workflow",
                icon: Users,
              },
              {
                step: "03",
                title: "Execute",
                description:
                  "Let the smart system guide your workflow and boost productivity",
                icon: BarChart,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white text-[#0D9488] font-bold text-sm px-2 py-1 rounded-full border-2 border-[#0D9488]">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 ">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Productive Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600 ">
              See what our users have to say about their experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600  mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 ">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 bg-gradient-to-br from-[#F0FDFA] to-[#F8FAFC]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 ">
              Choose the plan that fits your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                features: [
                  "Unlimited personal tasks",
                  "Basic collaboration (3 members)",
                  "Standard notifications",
                  "Mobile & web access",
                ],
                cta: "Get Started Free",
                popular: false,
              },
              {
                name: "Pro",
                price: "$9",
                period: "per month",
                features: [
                  "Unlimited team collaboration",
                  "Advanced analytics",
                  "Priority support",
                  "Custom integrations",
                  "Advanced reminders",
                ],
                cta: "Start Pro Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "contact us",
                features: [
                  "Advanced security",
                  "Custom deployment",
                  "Dedicated support",
                  "SLA guarantee",
                  "Custom features",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`relative bg-white p-8 rounded-xl shadow-lg border-2 ${
                  plan.popular
                    ? "border-[#0D9488] scale-105"
                    : "border-[#E2E8F0]"
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#0D9488] text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600  ml-2">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span className="text-gray-600 ">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? "bg-[#EA580C] text-white hover:bg-[#C2410C] hover:shadow-lg active:scale-[0.98]"
                      : "border-2 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488] hover:text-white"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your Data, Secured
            </h2>
            <p className="text-xl text-gray-600 ">
              Enterprise-grade security you can trust
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "End-to-End Encryption",
                description: "Your data is encrypted in transit and at rest",
              },
              {
                icon: Globe,
                title: "GDPR Compliant",
                description: "Full compliance with global privacy regulations",
              },
              {
                icon: Clock,
                title: "99.9% Uptime",
                description: "Reliable service with guaranteed availability",
              },
              // {
              //    icon: HiShieldCheck,
              //    title: 'SOC 2 Certified',
              //    description: 'Independently verified security controls',
              // },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center flex-1 min-w-[220px] max-w-xs"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 ">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-br from-[#0D9488] via-[#0D9488] to-[#0F766E]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform How You Work?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of productive teams who've already made the switch
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth/register"
                className="bg-white text-[#0D9488] px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Start Your Free Account</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="border-2 border-white/50 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-200">
                Schedule Demo
              </button>
            </div>
            <p className="text-white/70 mt-4 text-sm">
              No credit card required • Upgrade anytime • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
