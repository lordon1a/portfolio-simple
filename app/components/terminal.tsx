'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Folder, FileText as FileIcon, ChevronRight, CornerDownLeft, Save, XSquare } from 'lucide-react';
import { FileSystem, /* FileSystemNode, */ initialFileSystem, getCurrentDirectory /*, getNodeFromPath */ } from '../lib/terminal-filesystem';
import { handleCommandExecution, CommandResult } from '../lib/terminal-commands';



const Terminal: React.FC = () => {
  const [fileSystem, setFileSystem] = useState<FileSystem>(initialFileSystem);
  const [currentPath, setCurrentPath] = useState<string[]>(['home', 'user']);
  const [history, setHistory] = useState<{ command: string; output: React.ReactNode; path: string }[]>([]);
  const [command, setCommand] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [commandHistoryNavIndex, setCommandHistoryNavIndex] = useState<number>(-1);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editingFile, setEditingFile] = useState<{ name: string; content: string; originalPath: string[] } | null>(null);
  const [editText, setEditText] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const storedFileSystem = localStorage.getItem('terminalFileSystem');
    if (storedFileSystem) {
      try {
        setFileSystem(JSON.parse(storedFileSystem));
      } catch (e) {
        console.error("Failed to parse file system from localStorage", e);
        localStorage.removeItem('terminalFileSystem'); 
        setFileSystem(initialFileSystem);
      }
    } else {
      setFileSystem(initialFileSystem);
    }

    const storedPath = localStorage.getItem('terminalCurrentPath');
    if (storedPath) {
        try {
            const parsedPath = JSON.parse(storedPath);
            if (Array.isArray(parsedPath) && parsedPath.every(p => typeof p === 'string')) {
                setCurrentPath(parsedPath);
            } else {
                setCurrentPath(['home', 'user']);
            }
        } catch (e) {
            console.error("Failed to parse current path from localStorage", e);
            localStorage.removeItem('terminalCurrentPath');
            setCurrentPath(['home', 'user']);
        }
    } else {
        setCurrentPath(['home', 'user']);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('terminalFileSystem', JSON.stringify(fileSystem));
  }, [fileSystem]);

  useEffect(() => {
    localStorage.setItem('terminalCurrentPath', JSON.stringify(currentPath));
  }, [currentPath]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (!isEditing) {
        inputRef.current?.focus();
    } else {
        textAreaRef.current?.focus();
    }
  }, [history, isEditing]);
  
  useEffect(() => {
    if (!isEditing) inputRef.current?.focus();
    else textAreaRef.current?.focus();
  }, [isEditing]);

  const processCommand = (cmd: string) => {
    const [action, ...args] = cmd.trim().split(' ');

    const result: CommandResult = handleCommandExecution({
        command: action,
        args,
        currentPath,
        fileSystem,
        fullCommand: cmd,
        history,
        isEditing,
        editingFile,
        editText
    });

    let newHistoryEntryOutput = result.output;

    if (result.newFileSystem) {
        setFileSystem(result.newFileSystem);
    }
    if (result.newPath) {
        setCurrentPath(result.newPath);
    }
    if (result.enterEditMode) {
        setIsEditing(true);
        setEditingFile(result.enterEditMode.file);
        setEditText(result.enterEditMode.editText);
    }
    if (result.exitEditMode) {
        setIsEditing(false);
        setEditingFile(null);
        setEditText('');
    }
    if (result.shouldClearHistory) {
        setHistory([]);
        // For clear, the output might be empty, or handled by the command itself if needed.
        // If the command wants to add a message post-clearing, it should be in result.output.
        if (result.output) {
             // Add the specific output for clear/reset to the new history if provided
             setHistory([{ command: cmd, output: result.output, path: `/${currentPath.join('/')}` }]);
        }
        return; // Prevent default history addition for clear
    }
    if (result.shouldResetTerminal) {
        setFileSystem(initialFileSystem);
        setCurrentPath(['home', 'user']);
        setHistory([]); // Clear history first
        localStorage.removeItem('terminalFileSystem');
        localStorage.removeItem('terminalCurrentPath');
        // Add the reset message to the history
        setHistory([{ command: cmd, output: result.output, path: '/' }]);
        setIsEditing(false); // Ensure exit from edit mode on reset
        setEditingFile(null);
        setEditText('');
        setCommand(''); // Clear command input
        return; // Prevent default history addition for reset
    }

    // Add to history, unless it was a command that clears/resets history
    setHistory([...history, { command: cmd, output: newHistoryEntryOutput, path: `/${currentPath.join('/')}` }]);
    
    if (result.clearCommandInput) {
        setCommand('');
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() !== '' || isEditing) { // Process if command is not empty OR if in editor mode (for :w, :q)
        processCommand(command);
        // For command history navigation, point to the slot after the latest command for next 'up'
        // Only update if not entering edit mode, as editor has its own command logic
        if (!isEditing || (editingFile && (command === ':w' || command === ':q'))) {
             setCommandHistoryNavIndex(history.length + (command.trim() !== '' || (editingFile && (command === ':w' || command === ':q')) ? 1: 0) );
        }
    } else {
        // Add an empty history entry if user just presses enter outside of editor
        setHistory([...history, { command: '', output: '', path: `/${currentPath.join('/')}` }]);
        setCommandHistoryNavIndex(history.length + 1);
    }
    
    // Command input clearing is now handled by `processCommand` based on `result.clearCommandInput`
    // or if processCommand returned early for reset/clear.
    // However, if still in edit mode after a non-exit editor command, clear the editor command line
    if (isEditing && editingFile && command !== ':w' && command !== ':q') {
        setCommand(''); 
    }
  };
  
  const handleEditorCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(command); // command state holds :w or :q
    // Command input clearing is handled by processCommand via CommandResult.clearCommandInput
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const currentDir = getCurrentDirectory(currentPath, fileSystem); // Now uses imported getCurrentDirectory
      if (!currentDir) return;

      const commandParts = command.split(' ');
      const action = commandParts[0].toLowerCase();
      const partial = commandParts.pop() || '';
      
      if (partial) {
        const itemsInCurrentDir = Object.keys(currentDir);
        const potentialFilesAndFolders = action === 'cat' 
            ? itemsInCurrentDir.filter(name => currentDir[name].type === 'file') 
            : itemsInCurrentDir;

        const matches = potentialFilesAndFolders.filter(name => name.startsWith(partial));
        
        if (matches.length === 1) {
          const newCommand = [...commandParts, matches[0]].join(' ');
          setCommand(newCommand + (currentDir[matches[0]].type === 'folder' ? '/' : ' '));
        } else if (matches.length > 1) {
           const output = (
            <ul className="list-none p-0 m-0 flex flex-wrap gap-x-3">
              {matches.map((item) => (
                <li key={item} className={`flex items-center ${currentDir[item].type === 'folder' ? 'text-blue-400' : 'text-gray-300'}`}>
                  {item}
                </li>
              ))}
            </ul>
          );
          setHistory([...history, { command: '', output, path: `/${currentPath.join('/')}` }]);
        }
      }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length > 0) {
            const effectiveIndex = commandHistoryNavIndex === -1 || commandHistoryNavIndex > history.length -1 ? history.length -1 : commandHistoryNavIndex -1;
            const newIndex = Math.max(0, effectiveIndex);
            if (history[newIndex] && history[newIndex].command !== undefined) { // Check command is not undefined
                setCommand(history[newIndex].command);
                setCommandHistoryNavIndex(newIndex);
            }
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (history.length > 0 && commandHistoryNavIndex !== -1 && commandHistoryNavIndex < history.length - 1) {
            const newIndex = commandHistoryNavIndex + 1;
            if (history[newIndex] && history[newIndex].command !== undefined) { // Check command is not undefined
                setCommand(history[newIndex].command);
                setCommandHistoryNavIndex(newIndex);
            }
        } else if (commandHistoryNavIndex >= history.length - 1 || commandHistoryNavIndex === -1) {
             setCommand('');
             setCommandHistoryNavIndex(history.length);
        }
    }
  };

  return (
    <div 
      className="font-mono bg-gray-950 text-gray-300 p-3 rounded-lg border border-gray-800 h-[450px] flex flex-col text-xs shadow-xl relative"
      onClick={() => { if (!isEditing) inputRef.current?.focus(); else textAreaRef.current?.focus(); }}
    >
      <div ref={scrollRef} className="flex-grow overflow-y-auto mb-2 pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <div className="text-gray-500 mb-2">
          <p>Interactive Terminal [Version 1.0.0]</p>
          <p>(c) Portfolio Corp. All rights reserved.</p>
          <p className="mt-1">Current directory: <span className="text-purple-400">~/{currentPath.join('/') || ''}</span>. Type 'help' for commands.</p>
        </div>
        {history.map((entry, index) => (
          <div key={index} className="mb-1.5">
            <div className="flex items-center">
              <span className="text-green-400">user@portfolio</span>
              <span className="text-gray-500 mx-0.5">:</span>
              <span className="text-purple-400">~{entry.path || '/'}</span>
              <span className="text-gray-500 mx-0.5">$</span>
              <span className="text-gray-100 ml-1">{entry.command}</span>
            </div>
            {entry.output && <div className="pl-1 text-gray-400 output">{entry.output}</div>}
          </div>
        ))}
      </div>
      
      {isEditing && editingFile ?(
        <form onSubmit={handleEditorCommandSubmit} className="flex flex-col items-stretch mt-auto shrink-0 p-2 bg-gray-900 border-t border-gray-700 rounded-b-md">
            <div className='flex justify-between items-center mb-1'>
                <p className='text-amber-400'>Editing: {editingFile.name} (use :w to save, :q to quit)</p>
                <div>
                    <button type="button" onClick={() => processCommand(':w')} className="p-1 hover:bg-gray-700 rounded" title="Save">
                        <Save size={14} />
                    </button>
                    <button type="button" onClick={() => processCommand(':q')} className="p-1 ml-1 hover:bg-gray-700 rounded" title="Quit (no save)">
                        <XSquare size={14} />
                    </button>
                </div>
            </div>
          <textarea
            ref={textAreaRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="bg-gray-800 border border-gray-700 focus:ring-1 focus:ring-amber-500 outline-none w-full text-gray-100 placeholder-gray-500 p-1.5 rounded text-xs flex-grow min-h-[150px] resize-none scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            placeholder={`Content for ${editingFile.name}...`}
            spellCheck="false"
            autoFocus
          />
          {/* Input for :w and :q commands while editing */}
          <div className="flex items-center mt-1.5">
            <span className="text-gray-400 mr-1">:</span>
            <input 
                type="text"
                value={command} // use the main command state for this
                onChange={(e) => setCommand(e.target.value)}
                // onSubmit for this input is handled by the form's onSubmit
                className="bg-gray-700 border-none focus:ring-0 outline-none w-full text-gray-100 placeholder-gray-500 px-1 text-xs rounded-sm"
                placeholder="type :w or :q and press Enter"
            />
          </div>
        </form>
      ) : (
        <form onSubmit={handleCommandSubmit} className="flex items-center mt-auto shrink-0">
          <span className="text-green-400">user@portfolio</span>
          <span className="text-gray-500 mx-0.5">:</span>
          <span className="text-purple-400">~/{currentPath.join('/') || ''}</span>
          <span className="text-gray-500 mx-0.5">$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none focus:ring-0 outline-none w-full text-gray-100 placeholder-gray-500 ml-1"
            placeholder="type a command..."
            spellCheck="false"
            autoComplete="off"
          />
          <button type="submit" className="ml-2 text-gray-400 hover:text-amber-400" title="Execute command">
              <CornerDownLeft size={14} />
            </button>
        </form>
      )}
    </div>
  );
};

export default Terminal; 