'use client'
import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import Footer from './Footer';
import arg1 from '../../../public/arg1.jpg'
import coun1 from '../../../public/coun1.jpg'
import Image from 'next/image';

const RelationshipCardsSlider: React.FC = () => {
  const { theme } = useTheme();
  const cards = [
    {
      title: "Stale Relationships",
      description: "Revitalizing connections that have lost their spark.",
      icon: "✨",
      link: "/resources/stale-relationships"
    },
    {
      title: "Infidelity or Affairs",
      description: "Navigating trust and healing after a breach of fidelity.",
      icon: "💔",
      link: "/resources/infidelity"
    },
    {
      title: "Relationship Breakups",
      description: "Supporting you through the difficult process of separation.",
      icon: "🔗",
      link: "/resources/breakups"
    }
  ];

  return (
    <div className="py-16 px-4 md:px-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r dark:from-orange-400 dark:to-purple-500 from-purple-600 to-orange-500 bg-clip-text text-transparent">
        Related Resources
      </h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-[calc(100vw-40px)] md:w-[calc(50vw-40px)] lg:w-[calc(33vw-32px)]"
          >
            <Card className="group relative overflow-hidden p-6 md:p-8 rounded-2xl w-full transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl dark:bg-gray-700 dark:border-gray-600 bg-white border-gray-200">
              <div className="relative z-10">
                <div className="text-4xl mb-4 md:mb-6 transition-transform duration-300 group-hover:scale-110 dark:opacity-80 opacity-90">
                  {card.icon}
                </div>
                
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 bg-gradient-to-r dark:from-orange-400 dark:to-purple-500 from-purple-600 to-orange-500 bg-clip-text text-transparent">
                  {card.title}
                </h3>
                
                <p className="text-xs md:text-sm mb-4 md:mb-6 leading-relaxed dark:text-gray-300 text-gray-600">
                  {card.description}
                </p>
                
                <a
                  href={card.link}
                  className="text-xs md:text-sm font-medium transition-all duration-300 dark:text-orange-400 dark:hover:text-orange-300 text-purple-600 hover:text-purple-500 flex items-center gap-2 group-hover:translate-x-2"
                >
                  Learn more
                  <span className="text-lg">→</span>
                </a>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

const StuckRelationshipsPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('overview');

  const stuckRelationshipReasons = [
    {
      title: "Communication Breakdown",
      description: "Conversations become superficial, filled with misunderstandings and unaddressed emotions.",
      impact: "Creates emotional distance and resentment"
    },
    {
      title: "Unresolved Conflicts",
      description: "Persistent arguments that never reach resolution, creating a cycle of frustration.",
      impact: "Erodes trust and mutual respect"
    },
    {
      title: "Emotional Disconnection",
      description: "Feeling more like roommates than partners, losing intimacy and deep connection.",
      impact: "Leads to loneliness and potential relationship dissolution"
    }
  ];

  const healingApproaches = [
    {
      title: "Compassionate Communication",
      description: "Learning to express needs and feelings without blame, creating a safe emotional space.",
      benefit: "Rebuilds understanding and empathy"
    },
    {
      title: "Conflict Resolution Skills",
      description: "Developing strategies to address disagreements constructively and find mutual ground.",
      benefit: "Transforms conflicts into opportunities for growth"
    },
    {
      title: "Emotional Reconnection",
      description: "Intentional practices to rebuild intimacy, trust, and mutual appreciation.",
      benefit: "Revitalizes relationship dynamics"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white bg-white text-gray-900">
      <Header />
      
      {/* Hero Section with Image Placeholder */}
      <div className="relative py-16 px-4 md:px-16 mt-20">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r dark:from-orange-400 dark:to-purple-500 from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Breaking Free from Stuck Relationships
            </h1>
            <p className="text-base md:text-lg mb-8 dark:text-gray-300 text-gray-700">
              Feeling trapped in a relationship that's lost its spark? Our specialized approach helps couples navigate communication barriers, rebuild trust, and rediscover their connection.
            </p>
            <div className="flex space-x-4">
              <button className="px-6 py-3 rounded-full uppercase tracking-wider transition-all duration-300 dark:bg-orange-500 dark:hover:bg-orange-600 bg-purple-600 hover:bg-purple-700 text-white">
                Book Consultation
              </button>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-md aspect-square flex items-center justify-center border-4 rounded-2xl dark:border-gray-700 dark:bg-gray-800 border-gray-200 bg-gray-100">
              <Image
                src={arg1} 
                alt="Counseling process and relationship therapy" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Why Relationships Get Stuck */}
      <div className="py-16 px-4 md:px-16">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 bg-gradient-to-r dark:from-orange-400 dark:to-purple-500 from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Understanding Relationship Blockages
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {stuckRelationshipReasons.map((reason, index) => (
              <Card 
                key={index}
                className="p-6 rounded-2xl shadow-lg dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200"
              >
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r dark:from-orange-400 dark:to-purple-500 from-purple-600 to-orange-500 bg-clip-text text-transparent">
                  {reason.title}
                </h3>
                <p className="mb-4 dark:text-gray-300 text-gray-700">
                  {reason.description}
                </p>
                <div className="p-3 rounded-lg dark:bg-gray-700 bg-gray-100">
                  <p className="text-sm font-medium dark:text-gray-400 text-gray-600">
                    Impact: {reason.impact}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Healing and Growth Section */}
      <div className="py-16 px-4 md:px-16 dark:bg-gray-800 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 bg-gradient-to-r dark:from-orange-400 dark:to-purple-500 from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Pathways to Relationship Renewal
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {healingApproaches.map((approach, index) => (
              <Card 
                key={index}
                className="p-6 rounded-2xl shadow-lg dark:bg-gray-700 dark:border-gray-600 bg-white border-gray-200"
              >
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r dark:from-orange-400 dark:to-purple-500 from-purple-600 to-orange-500 bg-clip-text text-transparent">
                  {approach.title}
                </h3>
                <p className="mb-4 dark:text-gray-300 text-gray-700">
                  {approach.description}
                </p>
                <div className="p-3 rounded-lg dark:bg-gray-800 bg-gray-100">
                  <p className="text-sm font-medium dark:text-gray-400 text-gray-600">
                    Benefit: {approach.benefit}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Counseling Approach Section */}
      <div className="py-16 px-4 md:px-16">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Image Placeholder */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-md aspect-square flex items-center justify-center border-4 rounded-2xl dark:border-gray-700 dark:bg-gray-800 border-gray-200 bg-gray-100">
              <Image
                src={coun1} 
                alt="Counseling process and relationship therapy" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text Content */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r dark:from-orange-400 dark:to-purple-500 from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Our Counseling Approach
            </h2>
            <p className="mb-4 dark:text-gray-300 text-gray-700">
              We don't just listen—we guide. Our evidence-based approach helps couples:
            </p>
            <ul className="list-disc pl-5 mb-6 dark:text-gray-300 text-gray-700">
              <li className="mb-2">Identify root communication barriers</li>
              <li className="mb-2">Develop empathetic listening skills</li>
              <li className="mb-2">Rebuild emotional and physical intimacy</li>
              <li className="mb-2">Create sustainable relationship strategies</li>
            </ul>
            <p className="italic dark:text-gray-400 text-gray-600">
              Every relationship has potential. We're here to help you unlock yours.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 px-4 md:px-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r dark:from-orange-400 dark:to-purple-500 from-purple-600 to-orange-500 bg-clip-text text-transparent">
          Ready to Transform Your Relationship?
        </h2>
        <p className="max-w-2xl mx-auto mb-8 dark:text-gray-300 text-gray-700">
          Take the first step towards a more connected, understanding, and fulfilling relationship. Our expert counselors are ready to support your journey.
        </p>
        <button className="px-8 py-4 rounded-full uppercase tracking-wider text-lg transition-all duration-300 dark:bg-orange-500 dark:hover:bg-orange-600 bg-purple-600 hover:bg-purple-700 text-white">
          Schedule Your Consultation
        </button>
      </div>
      
      <RelationshipCardsSlider />
      <Footer />
    </div>
  );
};

export default StuckRelationshipsPage;