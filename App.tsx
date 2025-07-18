
import React, { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { StoryboardDisplay } from './components/StoryboardDisplay';
import { generateStoryboardFromText } from './services/geminiService';
import type { Scene } from './types';
import { DEFAULT_STYLE, STORY_STYLES, STORY_MOODS, DEFAULT_MOOD } from './constants';
import { LogoIcon } from './components/Icon';

const App: React.FC = () => {
  const [story, setStory] = useState<string>('');
  const [style, setStyle] = useState<string>(DEFAULT_STYLE);
  const [mood, setMood] = useState<string>(DEFAULT_MOOD);
  const [storyboard, setStoryboard] = useState<Scene[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const handleGenerate = useCallback(async () => {
    if (!story.trim()) {
      setError('Please enter a story or script to begin.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStoryboard(null);
    setProgress('Analyzing script and breaking down scenes...');

    try {
      const onProgressUpdate = (message: string) => {
        setProgress(message);
      };

      const generatedStoryboard = await generateStoryboardFromText(story, style, mood, onProgressUpdate);
      setStoryboard(generatedStoryboard);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during generation.');
    } finally {
      setIsLoading(false);
      setProgress('');
    }
  }, [story, style, mood]);

  const handleUpdateScene = (updatedScene: Scene) => {
    setStoryboard(prevStoryboard => {
        if (!prevStoryboard) return null;
        return prevStoryboard.map(scene => scene.sceneNumber === updatedScene.sceneNumber ? updatedScene : scene);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 p-4 sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <LogoIcon className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
              Storyboard AI
            </h1>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          <aside className="lg:col-span-4 xl:col-span-3">
            <ControlPanel
              story={story}
              setStory={setStory}
              style={style}
              setStyle={setStyle}
              mood={mood}
              setMood={setMood}
              styles={STORY_STYLES}
              moods={STORY_MOODS}
              isLoading={isLoading}
              onGenerate={handleGenerate}
            />
          </aside>
          
          <div className="lg:col-span-8 xl:col-span-9 bg-gray-800/50 rounded-lg border border-gray-700 min-h-[60vh] lg:min-h-0">
            <StoryboardDisplay
              storyboard={storyboard}
              isLoading={isLoading}
              error={error}
              progress={progress}
              onUpdateScene={handleUpdateScene}
            />
          </div>
        </div>
      </main>

       <footer className="text-center p-4 text-gray-500 text-sm border-t border-gray-800">
          <p>Powered by Gemini API. Created with React & Tailwind CSS.</p>
        </footer>
    </div>
  );
};

export default App;
