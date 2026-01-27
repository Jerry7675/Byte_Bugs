import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-700/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '-3s' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-gradient-radial from-green-300/20 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Trusted by 500+ Startups & Investors
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Where{' '}
              <span className="bg-gradient-to-r from-green-600 via-green-400 to-green-700 bg-clip-text text-transparent">
                Innovative Startups
              </span>{' '}
              Meet{' '}
              <span className="bg-gradient-to-r from-green-700 via-green-500 to-green-800 bg-clip-text text-transparent">
                Smart Investors
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              InvestLink bridges the gap between ambitious entrepreneurs and forward-thinking
              investors. Find your perfect match and turn ideas into reality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="hero"
                size="xl"
                className="group bg-green-600 text-white hover:bg-green-700"
              >
                <Rocket className="w-5 h-5" />
                I&apos;m a Startup
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="group border-green-700 text-green-700 hover:bg-green-50"
              >
                <TrendingUp className="w-5 h-5" />
                I&apos;m an Investor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <p className="font-display font-bold text-2xl md:text-3xl text-foreground">
                  $2.5B+
                </p>
                <p className="text-sm text-muted-foreground">Total Invested</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-display font-bold text-2xl md:text-3xl text-foreground">
                  1,200+
                </p>
                <p className="text-sm text-muted-foreground">Verified Startups</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-display font-bold text-2xl md:text-3xl text-foreground">850+</p>
                <p className="text-sm text-muted-foreground">Active Investors</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Main Card */}
              <div className="glass-card rounded-3xl p-6 md:p-8 animate-fade-up">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 via-green-400 to-green-700 flex items-center justify-center">
                      <Rocket className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-foreground">
                        TechVenture AI
                      </h3>
                      <p className="text-sm text-muted-foreground">Series A • Fintech</p>
                    </div>
                    <span className="ml-auto px-3 py-1 rounded-full bg-green-200 text-green-700 text-xs font-semibold">
                      Verified
                    </span>
                  </div>

                  <p className="text-muted-foreground">
                    AI-powered financial analytics platform helping SMBs make data-driven decisions.
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Seeking</p>
                      <p className="font-display font-bold text-foreground">$5M - $10M</p>
                    </div>
                    <Button
                      variant="accent"
                      size="sm"
                      className="bg-green-700 text-white hover:bg-green-800"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div
                className="absolute -top-4 -right-4 glass-card rounded-2xl p-4 animate-float"
                style={{ animationDelay: '-2s' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-200 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs text-green-700">New Match!</p>
                    <p className="font-semibold text-sm text-foreground">3 Investors Interested</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 animate-float"
                style={{ animationDelay: '-4s' }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-600 border-2 border-card" />
                    <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-card" />
                    <div className="w-8 h-8 rounded-full bg-green-800 border-2 border-card" />
                  </div>
                  <p className="text-sm text-green-700">+12 viewing now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
