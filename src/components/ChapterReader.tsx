import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface ChapterReaderProps {
  currentChapter: number;
  setCurrentChapter: (chapter: number) => void;
}

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  content: string;
}

const ChapterReader: React.FC<ChapterReaderProps> = ({ currentChapter, setCurrentChapter }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllChapters();
  }, []);

  const loadAllChapters = async () => {
    try {
      const chapterList: Chapter[] = [];
      
      // Load prologue first (index 0)
      try {
        const prologueResponse = await fetch('/content/prologue.md');
        if (prologueResponse.ok) {
          const prologueText = await prologueResponse.text();
          const prologueChapter = parseMarkdownChapter(prologueText, 0);
          chapterList.push(prologueChapter);
        }
      } catch (error) {
        console.warn('Could not load prologue');
      }

      // Load chapters 1-20
      for (let i = 1; i <= 20; i++) {
        try {
          const response = await fetch(`/content/chapter_${i}.md`);
          if (response.ok) {
            const text = await response.text();
            const chapter = parseMarkdownChapter(text, i);
            chapterList.push(chapter);
          }
        } catch (error) {
          console.warn(`Could not load chapter ${i}`);
        }
      }

      // Sort chapters by ID to ensure proper order (prologue=0, then 1, 2, 3...)
      chapterList.sort((a, b) => a.id - b.id);
      setChapters(chapterList);
    } catch (error) {
      console.error('Error loading chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseMarkdownChapter = (markdown: string, id: number): Chapter => {
    // Extract title from markdown (look for ### Chapter X: Title or ### Prologue: Title)
    const titleMatch = markdown.match(/^### (.+)$/m);
    const title = titleMatch ? titleMatch[1] : (id === 0 ? 'Prologue' : `Chapter ${id}`);
    
    // Extract subtitle if present (usually the next line after title)
    const lines = markdown.split('\n');
    const titleLineIndex = lines.findIndex(line => line.startsWith('### '));
    let subtitle = '';
    
    if (titleLineIndex >= 0 && titleLineIndex + 1 < lines.length) {
      const nextLine = lines[titleLineIndex + 1].trim();
      if (nextLine && !nextLine.startsWith('#')) {
        subtitle = nextLine;
      }
    }

    // If no subtitle found, use default
    if (!subtitle) {
      subtitle = id === 0 ? 'Where it all begins' : `Chapter ${id}`;
    }

    // Extract content (everything after the title and subtitle)
    const contentStartIndex = titleLineIndex >= 0 ? titleLineIndex + (subtitle ? 2 : 1) : 0;
    const content = lines.slice(contentStartIndex).join('\n').trim();

    return {
      id,
      title,
      subtitle,
      content
    };
  };

  const renderContent = (content: string) => {
    // Split content into paragraphs and handle code blocks
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      
      // Check if this is a code block (starts with ``` or has multiple lines with consistent indentation)
      if (trimmedParagraph.startsWith('```') || 
          (trimmedParagraph.includes('\n') && trimmedParagraph.split('\n').every(line => line.startsWith('  ') || line.trim() === ''))) {
        return (
          <div key={index} className="my-6 bg-gray-900 rounded-lg border border-green-500/30 overflow-hidden">
            <pre className="p-4 text-sm text-green-300 overflow-x-auto whitespace-pre-wrap break-words">
              <code className="font-mono leading-relaxed">
                {trimmedParagraph.replace(/^```[\w]*\n?/, '').replace(/```$/, '')}
              </code>
            </pre>
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-green-100 leading-relaxed mb-6 font-serif text-lg break-words">
          {trimmedParagraph}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-green-300 mt-4">Loading chapters...</p>
        </div>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-green-300">
          <p>No chapters available.</p>
        </div>
      </div>
    );
  }

  // Ensure currentChapter is within bounds
  const safeCurrentChapter = Math.max(0, Math.min(currentChapter, chapters.length - 1));
  const currentChapterData = chapters[safeCurrentChapter];
  
  if (!currentChapterData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-green-300">
          <p>Chapter not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Chapter Header */}
      <div className="text-center space-y-4 mb-8 sm:mb-12">
        <div className="flex items-center justify-center space-x-2 text-green-400">
          <BookOpen className="w-6 h-6" />
          <span className="text-sm font-semibold">
            {safeCurrentChapter === 0 ? 'Prologue' : `Chapter ${safeCurrentChapter}`}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-green-100 break-words">{currentChapterData.title}</h1>
        <p className="text-base sm:text-lg text-green-300 italic break-words">{currentChapterData.subtitle}</p>
      </div>

      {/* Chapter Content */}
      <div className="bg-gray-800 rounded-lg border border-green-500/20 p-4 sm:p-8 mb-8 overflow-hidden">
        <div className="prose prose-lg prose-invert prose-green max-w-none">
          {renderContent(currentChapterData.content)}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col space-y-6">
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentChapter(Math.max(0, safeCurrentChapter - 1))}
            disabled={safeCurrentChapter === 0}
            className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-lg transition-all duration-200 ${
              safeCurrentChapter === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/25'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="text-center text-green-400 text-sm font-medium px-2">
            {safeCurrentChapter + 1} of {chapters.length}
          </div>

          <button
            onClick={() => setCurrentChapter(Math.min(chapters.length - 1, safeCurrentChapter + 1))}
            disabled={safeCurrentChapter === chapters.length - 1}
            className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-lg transition-all duration-200 ${
              safeCurrentChapter === chapters.length - 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/25'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Chapter Dots - Hidden on mobile, wrapped on tablet+ */}
        <div className="hidden sm:flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {chapters.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentChapter(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === safeCurrentChapter
                    ? 'bg-green-400 shadow-lg shadow-green-400/50'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                title={`${index === 0 ? 'Prologue' : `Chapter ${index}`}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="flex justify-between text-sm text-green-400 mb-2">
          <span>Reading Progress</span>
          <span>{Math.round(((safeCurrentChapter + 1) / chapters.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((safeCurrentChapter + 1) / chapters.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ChapterReader;