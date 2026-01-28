import { Search, Handshake, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Create Your Profile",
    description: "Sign up as a startup or investor. Complete your profile with your goals, industry focus, and investment criteria.",
    colorClass: "bg-green-100 text-green-700",
  },
  {
    icon: Handshake,
    title: "Get Matched",
    description: "Our smart algorithm connects you with the perfect partners based on industry, stage, and investment preferences.",
    colorClass: "bg-green-200 text-green-800",
  },
  {
    icon: Rocket,
    title: "Collaborate & Grow",
    description: "Start meaningful conversations, share pitch decks, and close deals securely on our platform.",
    colorClass: "bg-green-100 text-green-700",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-green-50/30 to-green-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Three Simple Steps to Your Next Big Deal
          </h2>
          <p className="text-lg text-gray-600">
            Whether you're seeking funding or looking to invest, getting started is easy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-200 via-green-300 to-gray-200" />
              )}
              
              <div className="glass-card h-full rounded-2xl p-8 text-center relative group hover:-translate-y-2 transition-transform duration-300">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>

                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${step.colorClass}`}>
                  <step.icon className="w-8 h-8" />
                </div>

                <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
