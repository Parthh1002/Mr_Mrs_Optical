'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'How often should I get my eyes checked?',
    answer: 'We recommend a comprehensive eye exam every 1-2 years, depending on your age, risk factors, and whether you currently wear corrective lenses.',
  },
  {
    question: 'Do you offer computerized eye testing?',
    answer: 'Yes, our clinic is equipped with the latest computerized eye testing technology to ensure the most accurate prescription possible.',
  },
  {
    question: 'How long does it take to get a new pair of glasses?',
    answer: 'For standard prescriptions, glasses are usually ready within 2-3 business days. Complex prescriptions or specialized coatings may take up to a week.',
  },
  {
    question: 'Do you repair broken frames?',
    answer: 'Absolutely. We offer expert repair services for broken frames, hinge replacements, and nose pad adjustments for all brands.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about our services and eyewear.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-border rounded-2xl overflow-hidden bg-card"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-semibold text-lg text-foreground">{faq.question}</span>
                <span className="text-primary ml-4 shrink-0 bg-accent/30 p-2 rounded-full">
                  {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-5 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
