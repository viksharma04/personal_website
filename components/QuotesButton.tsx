'use client';
import React from 'react';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

const QuotesButton: React.FC = () => {
  return (
    <Link
      href="/quotes"
      className="fixed top-4 left-4 z-40 w-12 h-12 bg-black bg-opacity-70 hover:cursor-pointer rounded-full flex items-center justify-center text-green-500 hover:text-green-400 hover:border-green-400 transition-colors backdrop-blur-sm"
      aria-label="View quotes"
    >
      <BookOpen size={20} />
    </Link>
  );
};

export default QuotesButton;
