// import React, { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { MessageCircle, X, ArrowLeft, Clock, Calendar, CreditCard, Shield } from 'lucide-react';
// import { Card } from '@/components/ui/card';

// const knowledgeBase = {
//   getRandomResponse(category) {
//     const responses = {
//       services: [
//         {
//           text: "Here are some of our available counseling services:",
//           details: [
//             "• One-on-one virtual counseling sessions",
//             "• Group support sessions with peers",
//             "• Live chat support with counselors",
//             "• Emergency crisis support",
//             "• Relationship workshops",
//             "• Meditation and mindfulness sessions",
//             "• Interactive therapy exercises"
//           ]
//         },
//         {
//           text: "We offer various ways to support you:",
//           details: [
//             "• Personal counseling via video chat",
//             "• Supportive group sessions",
//             "• Private text-based counseling",
//             "• 24/7 crisis support access",
//             "• Guided self-help resources",
//             "• Weekly wellness check-ins",
//             "• Custom support plans"
//           ]
//         }
//       ],
//       process: [
//         {
//           text: "Here's how our counseling process works:",
//           details: [
//             "• Book a session at your preferred time",
//             "• Complete a brief initial assessment",
//             "• Meet your dedicated counselor",
//             "• Set goals together",
//             "• Regular progress check-ins",
//             "• Flexible session scheduling",
//             "• Access to support resources"
//           ]
//         },
//         {
//           text: "Getting started is simple:",
//           details: [
//             "• Choose your preferred time slot",
//             "• Fill out a quick questionnaire",
//             "• Get matched with a counselor",
//             "• Discuss your needs and goals",
//             "• Create an action plan",
//             "• Schedule follow-up sessions",
//             "• Track your progress"
//           ]
//         }
//       ],
//       therapists: [
//         {
//           text: "Our counselors are here to support you:",
//           details: [
//             "• Licensed professional counselors",
//             "• Specialized in various areas",
//             "• Regular training updates",
//             "• Experience in crisis support",
//             "• Multicultural competency",
//             "• Trauma-informed approach",
//             "• Ongoing supervision"
//           ]
//         },
//         {
//           text: "Meet our dedicated team of professionals:",
//           details: [
//             "• Certified relationship counselors",
//             "• Crisis intervention specialists",
//             "• Experienced therapists",
//             "• Cultural sensitivity training",
//             "• Diverse specializations",
//             "• Continuing education",
//             "• Professional development"
//           ]
//         }
//       ],
//       getStarted: [
//         {
//           text: "Ready to begin? Here's what you need to know:",
//           details: [
//             "• All services are completely free",
//             "• Available 24/7 for support",
//             "• No waitlist or delays",
//             "• Simple registration process",
//             "• Immediate access to resources",
//             "• Flexible scheduling options",
//             "• Ongoing support available"
//           ]
//         },
//         {
//           text: "Starting your journey is easy and free:",
//           details: [
//             "• Zero cost for all services",
//             "• Quick sign-up process",
//             "• Instant access to support",
//             "• Choose your schedule",
//             "• No commitment required",
//             "• Regular availability",
//             "• Continuous support"
//           ]
//         }
//       ]
//     };

//     const categoryResponses = responses[category];
//     if (!categoryResponses) {
//       return { 
//         text: "I'd be happy to help you with that.",
//         details: ["• Please let me know what specific information you're looking for."]
//       };
//     }
    
//     // Randomly select one of the response variants
//     return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
//   },
//   initialQuestions: [
//     {
//       id: 1,
//       text: "What counseling services are available?",
//       category: "services",
//       icon: "💭"
//     },
//     {
//       id: 2,
//       text: "How do sessions work?",
//       category: "process",
//       icon: "📝"
//     },
//     {
//       id: 3,
//       text: "Tell me about your therapists",
//       category: "therapists",
//       icon: "👤"
//     },
//     {
//       id: 4,
//       text: "How do I get started?",
//       category: "getStarted",
//       icon: "🌟"
//     }
//   ],
//   followUpQuestions: {
//     services: [
//       { text: "Do you offer emergency support?", icon: "🆘" },
//       { text: "What's the difference between your service types?", icon: "🔄" },
//       { text: "Do you have group therapy options?", icon: "👥" }
//     ],
//     process: [
//       { text: "How long are the sessions?", icon: "⏱️" },
//       { text: "What happens in the first session?", icon: "🆕" },
//       { text: "Can we switch therapists?", icon: "🔄" }
//     ],
//     therapists: [
//       { text: "What are their qualifications?", icon: "📜" },
//       { text: "Do you match couples with therapists?", icon: "🤝" },
//       { text: "Are therapists available 24/7?", icon: "🕒" }
//     ],
//     getStarted: [
//       { text: "How to schedule a session?", icon: "📅" },
//       { text: "What to expect?", icon: "✨" },
//       { text: "Is this really free?", icon: "🎁" }
//     ],
//     emergency: [
//       { text: "Get immediate help", icon: "🚨" },
//       { text: "Contact our crisis team", icon: "📞" },
//       { text: "Find local resources", icon: "📍" }
//     ],
//     scheduling: [
//       { text: "Check available time slots", icon: "📅" },
//       { text: "Request specific times", icon: "⭐" },
//       { text: "Recurring appointment info", icon: "🔄" }
//     ]
//   },
//   getResponse(category) {
//     const responses = {
//       services: {
//         text: "We offer comprehensive counseling services tailored to your needs:",
//         details: [
//           "• Individual & Couples Therapy - In-person or virtual sessions",
//           "• Online Chat Counseling - Flexible text-based support",
//           "• Crisis Intervention - 24/7 emergency support",
//           "• Group Therapy Sessions - Peer support and shared learning",
//           "• Specialized Programs - Including premarital counseling"
//         ]
//       },
//       process: {
//         text: "Here's how our counseling process works:",
//         details: [
//           "• Initial Consultation (45 minutes) - Free assessment",
//           "• Regular Sessions (60 minutes) - Weekly or bi-weekly",
//           "• Flexible Scheduling - Morning to evening availability",
//           "• Progress Tracking - Regular relationship assessments",
//           "• Custom Treatment Plans - Tailored to your goals"
//         ]
//       },
//       therapists: {
//         text: "Our therapists are highly qualified professionals:",
//         details: [
//           "• Licensed Marriage & Family Therapists (LMFT)",
//           "• 10+ years average experience",
//           "• Ongoing professional development",
//           "• Specialized relationship training",
//           "• Cultural competency certification"
//         ]
//       },
//       getStarted: {
//         text: "Getting started is easy and completely free:",
//         details: [
//           "• All our services are 100% free",
//           "• No hidden charges or fees",
//           "• Easy online scheduling",
//           "• Quick response times",
//           "• Unlimited access to support"
//         ]
//       },
//       emergency: {
//         text: "If you need immediate assistance:",
//         details: [
//           "• 24/7 Crisis Hotline: 1-800-XXX-XXXX",
//           "• Emergency Chat Support Available",
//           "• Direct Connection to On-Call Therapist",
//           "• Local Emergency Resources",
//           "• Safety Plan Development"
//         ]
//       },
//       scheduling: {
//         text: "Scheduling is easy and flexible:",
//         details: [
//           "• Online Booking System",
//           "• Same-Day Appointments Available",
//           "• Evening & Weekend Sessions",
//           "• Automated Reminders",
//           "• Easy Rescheduling Process"
//         ]
//       }
//     };
    
//     return responses[category] || { 
//       text: "I'd be happy to help you with that.",
//       details: ["• Please let me know what specific information you're looking for."] 
//     };
//   }
// };

// const ChatButton = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const [currentQuestions, setCurrentQuestions] = useState(knowledgeBase.initialQuestions);
//   const [chatHistory, setChatHistory] = useState([]);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, isTyping]);

//   // Function to shuffle array
//   const shuffleArray = (array) => {
//     const newArray = [...array];
//     for (let i = newArray.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//     }
//     return newArray;
//   };

//   // Function to get random items from array
//   const getRandomItems = (array, count) => {
//     return shuffleArray(array).slice(0, count);
//   };

//   const handleQuestionClick = async (question) => {
//     setChatHistory([...chatHistory, currentQuestions]);
    
//     const newMessages = [...messages, { 
//       text: question.text, 
//       sender: 'user',
//       icon: question.icon,
//       timestamp: new Date().toLocaleTimeString()
//     }];
//     setMessages(newMessages);
    
//     setIsTyping(true);
//     await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000)); // Random delay
    
//     const response = knowledgeBase.getRandomResponse(question.category);
//     setMessages([
//       ...newMessages, 
//       { 
//         text: response.text,
//         // Randomly select 3-4 details to show each time
//         details: getRandomItems(response.details, Math.floor(Math.random() * 2) + 3),
//         sender: 'bot',
//         timestamp: new Date().toLocaleTimeString()
//       }
//     ]);
    
//     const followUps = knowledgeBase.followUpQuestions[question.category];
//     if (followUps) {
//       // Shuffle and select random follow-up questions
//       const randomFollowUps = getRandomItems(followUps, 3);
//       setCurrentQuestions(
//         randomFollowUps.map((q, id) => ({
//           id,
//           text: q.text,
//           icon: q.icon,
//           category: question.category
//         }))
//       );
//     } else {
//       // Shuffle initial questions when returning to them
//       setCurrentQuestions(shuffleArray(knowledgeBase.initialQuestions));
//     }
    
//     setIsTyping(false);
//   };

//   const handleBack = () => {
//     if (chatHistory.length > 0) {
//       const previousQuestions = chatHistory[chatHistory.length - 1];
//       setCurrentQuestions(previousQuestions);
//       setChatHistory(chatHistory.slice(0, -1));
//     }
//   };

//   return (
//     <>
//       <motion.div 
//         className="fixed bottom-8 right-8 z-50"
//         initial={{ scale: 0 }}
//         animate={{ scale: 1 }}
//         transition={{ type: "spring", stiffness: 260, damping: 20 }}
//       >
//         <motion.button 
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => setIsOpen(true)}
//           className="px-6 py-3 rounded-full shadow-lg flex items-center gap-2 bg-purple-600 dark:bg-orange-500 text-white hover:bg-purple-700 dark:hover:bg-orange-600 transition-colors"
//         >
//           <MessageCircle className="w-5 h-5" />
//           <span className="font-medium">Chat with Us</span>
//         </motion.button>
//       </motion.div>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             className="fixed bottom-24 right-8 z-50 w-96"
//           >
//             <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border-0">
//               <div className="p-4 bg-purple-600 dark:bg-orange-500 text-white flex items-center gap-3">
//                 {chatHistory.length > 0 && (
//                   <button 
//                     onClick={handleBack}
//                     className="p-1 hover:bg-white/20 rounded-full transition-colors"
//                   >
//                     <ArrowLeft className="w-5 h-5" />
//                   </button>
//                 )}
//                 <div className="flex-1">
//                   <h3 className="font-medium">MiCounselor Support</h3>
//                   <p className="text-xs opacity-90">We typically reply in a few minutes</p>
//                 </div>
//                 <button 
//                   onClick={() => setIsOpen(false)}
//                   className="p-1 hover:bg-white/20 rounded-full transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
              
//               <div className="h-96 overflow-y-auto p-4 space-y-4">
//                 {messages.length === 0 && (
//                   <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
//                     👋 Hello! How can we assist you today?
//                   </div>
//                 )}
                
//                 {messages.map((msg, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div
//                       className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
//                         msg.sender === 'user'
//                           ? 'bg-purple-600 dark:bg-orange-500 text-white'
//                           : 'bg-gray-100 dark:bg-gray-700'
//                       }`}
//                     >
//                       <div className="flex items-center gap-2 mb-1">
//                         {msg.sender === 'user' && msg.icon && (
//                           <span>{msg.icon}</span>
//                         )}
//                         <span className="text-xs opacity-70">{msg.timestamp}</span>
//                       </div>
//                       <div className="font-medium">{msg.text}</div>
//                       {msg.details && (
//                         <div className="mt-2 space-y-1 text-sm opacity-90">
//                           {msg.details.map((detail, i) => (
//                             <div key={i}>{detail}</div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 ))}
                
//                 {isTyping && (
//                   <motion.div 
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="flex gap-2 p-4 max-w-[80%] bg-gray-100 dark:bg-gray-700 rounded-2xl shadow-sm"
//                   >
//                     <div className="flex gap-1">
//                       <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
//                       <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
//                       <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
//                     </div>
//                   </motion.div>
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>
              
//               {!isTyping && (
//                 <motion.div 
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="p-4 border-t dark:border-gray-700"
//                 >
//                   <div className="grid gap-2">
//                     {currentQuestions.map((question) => (
//                       <motion.button
//                         key={question.id}
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => handleQuestionClick(question)}
//                         className="p-4 text-left rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-3 group"
//                       >
//                         <span className="text-xl group-hover:scale-110 transition-transform">
//                           {question.icon}
//                         </span>
//                         <span className="flex-1">{question.text}</span>
//                       </motion.button>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}
//             </Card>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default ChatButton;