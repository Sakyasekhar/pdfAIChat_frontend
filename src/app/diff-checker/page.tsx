"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Edit2, Columns, Check, Copy, Undo2, Redo2 } from 'lucide-react';
import { diffLines } from 'diff';

interface AlignedBlock {
  type: 'unchanged' | 'diff';
  leftLines: string[];
  rightLines: string[];
  leftStartLine: number;
  rightStartLine: number;
  diffId?: string;
}

function EditableLine({ initialValue, onCommit }: { initialValue: string; onCommit: (val: string) => void }) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) setValue(initialValue);
  }, [initialValue, isEditing]);

  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
      onFocus={() => setIsEditing(true)}
      onBlur={() => {
        setIsEditing(false);
        if (value !== initialValue) onCommit(value);
      }}
      className="flex-1 bg-transparent outline-none w-full font-inherit"
      spellCheck={false}
    />
  );
}

const INITIAL_LEFT = "const add = (a, b) => {\n  return a + b;\n}\n\nconsole.log(add(1, 2));\n";
const INITIAL_RIGHT = "const add = (a, b) => {\n  // adds two numbers\n  return a + b;\n}\n\nconsole.log('Result:', add(1, 2));\n";

export default function DiffCheckerPage() {
  const [state, setState] = useState({
    leftText: INITIAL_LEFT,
    rightText: INITIAL_RIGHT,
    history: [{ left: INITIAL_LEFT, right: INITIAL_RIGHT }],
    currentIndex: 0
  });
  const [isEditing, setIsEditing] = useState(false);

  const { leftText, rightText, history, currentIndex } = state;

  const commitHistory = (newLeft: string, newRight: string) => {
    setState(prevState => {
      const lastSnapshot = prevState.history[prevState.currentIndex];
      if (lastSnapshot.left === newLeft && lastSnapshot.right === newRight) {
        return { ...prevState, leftText: newLeft, rightText: newRight };
      }
      
      const newHistory = prevState.history.slice(0, prevState.currentIndex + 1);
      newHistory.push({ left: newLeft, right: newRight });
      if (newHistory.length > 50) newHistory.shift();
      
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
        leftText: newLeft,
        rightText: newRight
      };
    });
  };

  const handleUndo = useCallback(() => {
    setState(prevState => {
      if (prevState.currentIndex > 0) {
        const nextIndex = prevState.currentIndex - 1;
        const snapshot = prevState.history[nextIndex];
        return { ...prevState, currentIndex: nextIndex, leftText: snapshot.left, rightText: snapshot.right };
      }
      return prevState;
    });
  }, []);

  const handleRedo = useCallback(() => {
    setState(prevState => {
      if (prevState.currentIndex < prevState.history.length - 1) {
        const nextIndex = prevState.currentIndex + 1;
        const snapshot = prevState.history[nextIndex];
        return { ...prevState, currentIndex: nextIndex, leftText: snapshot.left, rightText: snapshot.right };
      }
      return prevState;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
      
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (!isInputFocused) {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        }
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        if (!isInputFocused) {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const blocks = useMemo(() => {
    // If we're in edit mode, we don't strictly need to compute blocks, but doing it anyway is fast enough.
    if (typeof window === 'undefined') return []; // safety for SSR
    
    const chunks = diffLines(leftText, rightText);
    const alignedBlocks: AlignedBlock[] = [];
    let leftLineNum = 1;
    let rightLineNum = 1;

    let pendingRemoved: string[] | null = null;
    let pendingAdded: string[] | null = null;

    const flushPending = () => {
      if (pendingRemoved || pendingAdded) {
        alignedBlocks.push({
          type: 'diff',
          leftLines: pendingRemoved || [],
          rightLines: pendingAdded || [],
          leftStartLine: leftLineNum,
          rightStartLine: rightLineNum,
          diffId: Math.random().toString(36).substr(2, 9),
        });
        if (pendingRemoved) leftLineNum += pendingRemoved.length;
        if (pendingAdded) rightLineNum += pendingAdded.length;
        pendingRemoved = null;
        pendingAdded = null;
      }
    };

    for (const chunk of chunks) {
      const lines = chunk.value.replace(/\n$/, '').split('\n');
      
      if (chunk.removed) {
        if (pendingAdded) {
          flushPending();
          pendingRemoved = lines;
        } else if (pendingRemoved) {
          pendingRemoved = pendingRemoved.concat(lines);
        } else {
          pendingRemoved = lines;
        }
      } else if (chunk.added) {
        if (pendingAdded) {
          pendingAdded = pendingAdded.concat(lines);
        } else {
          pendingAdded = lines;
        }
      } else {
        flushPending();
        alignedBlocks.push({
          type: 'unchanged',
          leftLines: lines,
          rightLines: lines,
          leftStartLine: leftLineNum,
          rightStartLine: rightLineNum,
        });
        leftLineNum += lines.length;
        rightLineNum += lines.length;
      }
    }
    flushPending();
    
    return alignedBlocks;
  }, [leftText, rightText]);

  const applyLineDiff = (block: AlignedBlock, i: number, direction: 'left-to-right' | 'right-to-left') => {
    setState(prevState => {
      let newLeft = prevState.leftText;
      let newRight = prevState.rightText;

      if (direction === 'left-to-right') {
        const rightArr = newRight.split('\n');
        const leftLine = block.leftLines[i];
        const targetIdx = block.rightStartLine - 1 + i;

        if (i < block.rightLines.length) {
          if (leftLine === undefined) rightArr.splice(targetIdx, 1);
          else rightArr[targetIdx] = leftLine;
        } else {
          if (leftLine !== undefined) rightArr.splice(targetIdx, 0, leftLine);
        }
        newRight = rightArr.join('\n');
      } else {
        const leftArr = newLeft.split('\n');
        const rightLine = block.rightLines[i];
        const targetIdx = block.leftStartLine - 1 + i;

        if (i < block.leftLines.length) {
          if (rightLine === undefined) leftArr.splice(targetIdx, 1);
          else leftArr[targetIdx] = rightLine;
        } else {
          if (rightLine !== undefined) leftArr.splice(targetIdx, 0, rightLine);
        }
        newLeft = leftArr.join('\n');
      }

      const lastSnapshot = prevState.history[prevState.currentIndex];
      if (lastSnapshot.left === newLeft && lastSnapshot.right === newRight) {
        return prevState;
      }
      
      const newHistory = prevState.history.slice(0, prevState.currentIndex + 1);
      newHistory.push({ left: newLeft, right: newRight });
      if (newHistory.length > 50) newHistory.shift();
      
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
        leftText: newLeft,
        rightText: newRight
      };
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Diff Checker</h1>
        </div>
        
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm p-1">
            <button
              onClick={handleUndo}
              disabled={currentIndex === 0}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={handleRedo}
              disabled={currentIndex === history.length - 1}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          <button 
            onClick={() => {
              commitHistory(leftText, rightText);
              setIsEditing(!isEditing);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors text-sm font-medium"
          >
            {isEditing ? <Columns className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {isEditing ? 'Compare Mode' : 'Full Editor'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-[#2d2d2d] border-b border-gray-200 dark:border-zinc-700 shrink-0">
          <div className="flex items-center gap-2 font-medium text-sm text-gray-600 dark:text-gray-300 w-[calc(50%-20px)]">
            Original Text
            <button onClick={() => copyToClipboard(leftText)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded" title="Copy Left">
               <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="w-[40px]"></div>
          <div className="flex items-center gap-2 font-medium text-sm text-gray-600 dark:text-gray-300 w-[calc(50%-20px)]">
            Modified Text
            <button onClick={() => copyToClipboard(rightText)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded" title="Copy Right">
               <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Editor / Viewer */}
        <div className="flex-1 overflow-auto relative">
          {isEditing ? (
            <div className="flex w-full h-full absolute inset-0">
              <textarea 
                value={leftText}
                onChange={(e) => commitHistory(e.target.value, rightText)}
                className="w-1/2 h-full p-4 resize-none outline-none bg-transparent font-mono text-sm border-r border-gray-200 dark:border-zinc-700"
                placeholder="Paste original text here..."
                spellCheck={false}
              />
              <textarea 
                value={rightText}
                onChange={(e) => commitHistory(leftText, e.target.value)}
                className="w-1/2 h-full p-4 resize-none outline-none bg-transparent font-mono text-sm"
                placeholder="Paste modified text here..."
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="flex flex-col min-w-max">
              {blocks.map((block, index) => {
                const maxLines = Math.max(block.leftLines.length, block.rightLines.length);
                return (
                  <div key={index} className="flex relative group border-b border-transparent hover:border-gray-100 dark:hover:border-zinc-800">
                    
                    {/* Left Side */}
                    <div className="w-[calc(50vw-2rem)] sm:w-[calc(50vw-4rem)] max-w-[50%] shrink-0">
                      {Array.from({ length: maxLines }).map((_, i) => {
                        const line = block.leftLines[i];
                        const isFiller = line === undefined;
                        return (
                          <div key={i} className={`h-6 flex items-center px-2 font-mono text-[13px] ${block.type === 'diff' && !isFiller ? 'bg-[#ffebe9] dark:bg-[#4a2325] text-[#24292f] dark:text-[#f85149]' : 'text-gray-800 dark:text-gray-300'}`}>
                            <span className="w-10 text-right text-gray-400 dark:text-gray-600 select-none mr-4 shrink-0">
                              {!isFiller ? block.leftStartLine + i : ''}
                            </span>
                            {!isFiller ? (
                              <EditableLine 
                                initialValue={line} 
                                onCommit={(val) => {
                                  const arr = leftText.split('\n');
                                  arr[block.leftStartLine - 1 + i] = val;
                                  commitHistory(arr.join('\n'), rightText);
                                }}
                              />
                            ) : (
                              <span className="flex-1"> </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Middle Arrows */}
                    <div className="w-[40px] shrink-0 bg-gray-50 dark:bg-[#252525] border-x border-gray-200 dark:border-zinc-700 flex flex-col items-center">
                      {block.type === 'diff' && Array.from({ length: maxLines }).map((_, i) => (
                        <div key={i} className="h-6 w-full flex items-center justify-center relative group/line">
                          {/* A tiny dot when not hovered */}
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-600 group-hover/line:opacity-0 transition-opacity" />
                          
                          {/* Arrows on hover */}
                          <div className="absolute inset-0 flex items-center justify-center gap-0.5 opacity-0 group-hover/line:opacity-100 bg-gray-200 dark:bg-zinc-700 z-10 transition-opacity">
                             <button 
                               onClick={() => applyLineDiff(block, i, 'left-to-right')} 
                               className="p-0.5 hover:bg-white dark:hover:bg-zinc-600 rounded text-blue-600 dark:text-blue-400"
                               title="Push left line to right"
                             >
                               <ArrowRight className="w-3.5 h-3.5" />
                             </button>
                             <button 
                               onClick={() => applyLineDiff(block, i, 'right-to-left')} 
                               className="p-0.5 hover:bg-white dark:hover:bg-zinc-600 rounded text-blue-600 dark:text-blue-400"
                               title="Push right line to left"
                             >
                               <ArrowLeft className="w-3.5 h-3.5" />
                             </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Side */}
                    <div className="w-[calc(50vw-2rem)] sm:w-[calc(50vw-4rem)] max-w-[50%] shrink-0">
                      {Array.from({ length: maxLines }).map((_, i) => {
                        const line = block.rightLines[i];
                        const isFiller = line === undefined;
                        return (
                          <div key={i} className={`h-6 flex items-center px-2 font-mono text-[13px] ${block.type === 'diff' && !isFiller ? 'bg-[#e6ffec] dark:bg-[#23452b] text-[#24292f] dark:text-[#3fb950]' : 'text-gray-800 dark:text-gray-300'}`}>
                            <span className="w-10 text-right text-gray-400 dark:text-gray-600 select-none mr-4 shrink-0">
                              {!isFiller ? block.rightStartLine + i : ''}
                            </span>
                            {!isFiller ? (
                              <EditableLine 
                                initialValue={line} 
                                onCommit={(val) => {
                                  const arr = rightText.split('\n');
                                  arr[block.rightStartLine - 1 + i] = val;
                                  commitHistory(leftText, arr.join('\n'));
                                }}
                              />
                            ) : (
                              <span className="flex-1"> </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
