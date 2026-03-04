import React from 'react';
import { FileSystem, FileSystemNode, getCurrentDirectory } from './terminal-filesystem';
import { Folder, FileText as FileIcon } from 'lucide-react';

export interface CommandResult {
  output: React.ReactNode;
  newPath?: string[];
  newFileSystem?: FileSystem;
  newHistory?: { command: string; output: React.ReactNode; path: string }[];
  shouldClearHistory?: boolean;
  shouldResetTerminal?: boolean;
  enterEditMode?: {
    file: { name: string; content: string; originalPath: string[] };
    editText: string;
  };
  exitEditMode?: boolean;
  clearCommandInput?: boolean;
}

interface CommandHandlerArgs {
  command: string;
  args: string[];
  currentPath: string[];
  fileSystem: FileSystem;
  fullCommand: string;
  history: { command: string; output: React.ReactNode; path: string }[];
  isEditing: boolean;
  editingFile: { name: string; content: string; originalPath: string[] } | null;
  editText: string;
}

export const handleCommandExecution = (handlerArgs: CommandHandlerArgs): CommandResult => {
  const { command, args, currentPath, fileSystem, fullCommand, history, isEditing, editingFile, editText } = handlerArgs;
  
  let output: React.ReactNode = '';
  let newPath: string[] | undefined = undefined;
  let newFileSystemInstance: FileSystem | undefined = JSON.parse(JSON.stringify(fileSystem));
  let enterEditMode: CommandResult['enterEditMode'] | undefined = undefined;
  let exitEditMode: boolean | undefined = undefined;
  let shouldClearHistory: boolean | undefined = undefined;
  let shouldResetTerminal: boolean | undefined = undefined;

  const currentDirContents = getCurrentDirectory(currentPath, newFileSystemInstance!);

  if (isEditing && editingFile) {
    if (fullCommand.trim() === ':w') {
      const dirOfEditingFile = getCurrentDirectory(editingFile.originalPath, newFileSystemInstance!);
      if (dirOfEditingFile && dirOfEditingFile[editingFile.name]) {
        dirOfEditingFile[editingFile.name].content = editText;
        output = `File "${editingFile.name}" saved.`;
      } else {
        output = `Error: Could not find original file ${editingFile.name} to save.`;
      }
      exitEditMode = true;
    } else if (fullCommand.trim() === ':q') {
      output = `Exited editor for "${editingFile.name}". Changes not saved.`;
      exitEditMode = true;
    } else {
      output = `Editor mode: Use :w to save, :q to quit. Your input "${fullCommand}" was not an editor command.`;
      newFileSystemInstance = undefined;
    }
    return { output, newFileSystem: newFileSystemInstance, exitEditMode, clearCommandInput: true };
  }

  switch (command.toLowerCase()) {
    case 'mkdir':
      if (args.length === 0) {
        output = 'Usage: mkdir <directory_name>';
      } else {
        const dirName = args[0];
        if (!currentDirContents) {
          output = `Error: Current path "/${currentPath.join('/')}" not found.`;
          newFileSystemInstance = undefined;
          break;
        }
        if (currentDirContents[dirName]) {
          output = `Error: Directory or file "${dirName}" already exists.`;
        } else if (!/^[a-zA-Z0-9_.-]+$/.test(dirName)) {
          output = `Error: Invalid directory name "${dirName}". Use alphanumeric characters, underscores, hyphens or periods.`;
        }
         else {
          currentDirContents[dirName] = { type: 'folder', name: dirName, children: {} };
          output = `Directory "${dirName}" created.`;
        }
      }
      break;
    case 'ls':
      if (!currentDirContents) {
        output = `Error: Current path "/${currentPath.join('/')}" not found.`;
        newFileSystemInstance = undefined;
        break;
      }
      const targetLsPath = args[0];
      let dirToList = currentDirContents;
      if (targetLsPath) {
          let tempLsPath = targetLsPath.startsWith('/') ? [] : [...currentPath];
          const segments = targetLsPath.split('/').filter(p => p);
          for (const segment of segments) {
              if (segment === '..') {
                  if (tempLsPath.length > 0) tempLsPath.pop();
                  else { output = "Error: Cannot ls above root."; break; }
              } else if (segment !== '.') {
                  const tempDir = getCurrentDirectory(tempLsPath, newFileSystemInstance!); // Added non-null assertion
                  if (tempDir && tempDir[segment] && tempDir[segment].type === 'folder') {
                      tempLsPath.push(segment);
                  } else {
                      output = `Error: Directory "${targetLsPath}" not found for ls.`;
                      break;
                  }
              }
          }
          if (output) {newFileSystemInstance = undefined; break; }
          dirToList = getCurrentDirectory(tempLsPath, newFileSystemInstance!) || {}; // Added non-null assertion
      }

      output = (
        <ul className="list-none p-0 m-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-2">
          {Object.values(dirToList).map((item: FileSystemNode) => (
            <li key={item.name} className={`flex items-center ${item.type === 'folder' ? 'text-blue-400' : 'text-gray-300'}`}>
              {item.type === 'folder' ? <Folder size={12} className="mr-1 flex-shrink-0" /> : <FileIcon size={12} className="mr-1 flex-shrink-0" />}
              <span className="truncate">{item.name}</span>
            </li>
          ))}
        </ul>
      );
      if (Object.keys(dirToList).length === 0) {
        output = <span className="text-gray-500">(empty)</span>;
      }
      newFileSystemInstance = undefined;
      break;
    case 'cd':
      let tempCdPath = [...currentPath];
      if (args.length === 0) {
        tempCdPath = ['home', 'user']; 
      } else {
        const targetPath = args[0];
        if (targetPath === '/') {
          tempCdPath = []; 
        } else {
          let pathBuilder = targetPath.startsWith('/') ? [] : [...currentPath];
          const pathSegments = targetPath.split('/').filter(p => p);
          
          let validNavigation = true;
          for (const segment of pathSegments) {
              if (segment === '..') {
                  if (pathBuilder.length > 0) {
                    pathBuilder.pop();
                  } 
              } else if (segment === '.') {
                  
              } else {
                  const dirToTest = getCurrentDirectory(pathBuilder, newFileSystemInstance!); // Added non-null assertion
                  if (dirToTest && dirToTest[segment] && dirToTest[segment].type === 'folder') {
                    pathBuilder.push(segment);
                  } else {
                      output = `Error: Directory "${targetPath}" not found.`;
                      validNavigation = false;
                      break;
                  }
              }
          }
          if (validNavigation) tempCdPath = pathBuilder;
        }
      }
      
      if (!output) {
          if (tempCdPath.length === 0 || getCurrentDirectory(tempCdPath, newFileSystemInstance!)) { // Added non-null assertion
                newPath = tempCdPath;
          } else {
              output = `Error: Path "/${tempCdPath.join('/')}" does not resolve to a valid directory.`
          }
      }
      newFileSystemInstance = undefined;
      break;
    case 'pwd':
      output = `/${currentPath.join('/')}`;
      newFileSystemInstance = undefined;
      break;
    case 'cat':
      if (args.length === 0) {
        output = 'Usage: cat <file_name_or_path>';
      } else {
        const filePathArg = args.join(' ');
        const pathParts = filePathArg.split('/').filter(p => p);
        const fileNameArg = pathParts.pop();

        if (!fileNameArg) {
          output = 'Usage: cat <file_name_or_path>';
          newFileSystemInstance = undefined;
          break;
        }

        let dirPathSegments = filePathArg.startsWith('/') ? [] : [...currentPath];
        if (pathParts.length > 0) { 
          for (const segment of pathParts) {
            if (segment === '..') {
              if (dirPathSegments.length > 0) dirPathSegments.pop();
            } else if (segment !== '.') {
              const tempCheckDir = getCurrentDirectory([...dirPathSegments, segment], newFileSystemInstance!); // Added non-null assertion
              if (tempCheckDir) {
                  dirPathSegments.push(segment);
              } else {
                  output = `Error: Directory path in "${filePathArg}" not found.`;
                  break;
              }
            }
          }
        }
        if (output) {newFileSystemInstance = undefined; break;} 

        const targetDirectoryContents = getCurrentDirectory(dirPathSegments, newFileSystemInstance!); // Added non-null assertion

        if (!targetDirectoryContents) {
          output = `Error: Directory for "${filePathArg}" not found.`;
          newFileSystemInstance = undefined;
          break;
        }

        let actualFileName: string | undefined = undefined;
        for (const itemName in targetDirectoryContents) {
          if (itemName.toLowerCase() === fileNameArg.toLowerCase()) {
            actualFileName = itemName;
            break;
          }
        }

        if (actualFileName && targetDirectoryContents[actualFileName] && targetDirectoryContents[actualFileName].type === 'file') {
          const fileNode = targetDirectoryContents[actualFileName] as FileSystemNode;
          output = <pre className="whitespace-pre-wrap text-xs">{fileNode.content || '(empty file)'}</pre>;
        } else {
          const pathPrefix = dirPathSegments.length > 0 ? `/${dirPathSegments.join('/')}` : '(root)';
          output = `Error: File "${fileNameArg}" not found in ${pathPrefix} or is a directory.`;
        }
      }
      newFileSystemInstance = undefined;
      break;
    case 'touch':
      if (args.length === 0) {
        output = 'Usage: touch <file_name>';
      } else {
        const fileName = args[0];
        if (!currentDirContents) {
          output = `Error: Current path "/${currentPath.join('/')}" not found.`;
          newFileSystemInstance = undefined;
          break;
        }
        if (currentDirContents[fileName]) {
          if (currentDirContents[fileName].type === 'file') {
            output = `File "${fileName}" already exists.`; 
          } else {
            output = `Error: "${fileName}" is a directory.`;
          }
        } else if (!/^[a-zA-Z0-9_.-]+$/.test(fileName)) {
          output = `Error: Invalid file name "${fileName}". Use alphanumeric characters, underscores, hyphens or periods.`;
        } else {
          currentDirContents[fileName] = { type: 'file', name: fileName, content: '' };
          output = `File "${fileName}" created.`;
        }
      }
      break;
    case 'rm':
      if (args.length === 0) {
        output = 'Usage: rm <file_or_empty_directory_name>';
      } else {
        const itemName = args[0];
        if (!currentDirContents) {
          output = `Error: Current path "/${currentPath.join('/')}" not found.`;
          newFileSystemInstance = undefined;
          break;
        }

        let actualItemName: string | undefined = undefined;
        for (const nameInDir in currentDirContents) {
          if (nameInDir.toLowerCase() === itemName.toLowerCase()) {
            actualItemName = nameInDir;
            break;
          }
        }

        if (!actualItemName || !currentDirContents[actualItemName]) {
          output = `Error: File or directory "${itemName}" not found.`;
        } else {
          const itemToRemove = currentDirContents[actualItemName];
          if (itemToRemove.type === 'folder') {
            if (itemToRemove.children && Object.keys(itemToRemove.children).length === 0) {
              delete currentDirContents[actualItemName];
              output = `Directory "${actualItemName}" removed.`;
            } else {
              output = `Error: Directory "${actualItemName}" is not empty.`;
            }
          } else {
            delete currentDirContents[actualItemName];
            output = `File "${actualItemName}" removed.`;
          }
        }
      }
      break;
    case 'edit':
      if (args.length === 0) {
        output = 'Usage: edit <file_name_or_path>';
        newFileSystemInstance = undefined;
      } else {
        const filePathArg = args.join(' ');
        const segments = filePathArg.split('/').filter(p => p);
        const editFileNameArg = segments.pop(); 

        if (!editFileNameArg) {
          output = 'Usage: edit <file_name_or_path> (filename missing)';
          newFileSystemInstance = undefined;
          break;
        }

        let dirForEditPath = filePathArg.startsWith('/') ? [] : [...currentPath];
        if (segments.length > 0) { 
          const pathOnlySegments = filePathArg.includes('/') ? filePathArg.substring(0, filePathArg.lastIndexOf('/')).split('/').filter(p =>p) : [];
          dirForEditPath = filePathArg.startsWith('/') ? [] : [...currentPath]; 

          if (filePathArg.startsWith('/')) dirForEditPath = [];
          
          for(const segment of pathOnlySegments) {
              if (segment === '..') {
                  if(dirForEditPath.length > 0) dirForEditPath.pop();
              } else if (segment !== '.') {
                  const tempCheckDir = getCurrentDirectory(dirForEditPath, newFileSystemInstance!); // Added non-null assertion
                  if(tempCheckDir && tempCheckDir[segment] && tempCheckDir[segment].type === 'folder'){
                      dirForEditPath.push(segment);
                  } else {
                      output = `Error: Directory path in "${filePathArg}" not found for edit.`;
                      break;
                  }
              }
          }
        }
        if(output) {newFileSystemInstance = undefined; break;} 

        const targetEditDirectoryContents = getCurrentDirectory(dirForEditPath, newFileSystemInstance!); // Added non-null assertion
        if (!targetEditDirectoryContents) {
          output = `Error: Directory for "${filePathArg}" not found.`;
          newFileSystemInstance = undefined;
          break;
        }

        let actualEditFileName: string | undefined = undefined;
        for (const itemName in targetEditDirectoryContents) {
          if (itemName.toLowerCase() === editFileNameArg.toLowerCase()) {
            actualEditFileName = itemName;
            break;
          }
        }

        if (actualEditFileName && targetEditDirectoryContents[actualEditFileName] && targetEditDirectoryContents[actualEditFileName].type === 'file') {
          const fileNode = targetEditDirectoryContents[actualEditFileName] as FileSystemNode;
          enterEditMode = {
            file: { name: actualEditFileName, content: fileNode.content || '', originalPath: [...dirForEditPath] },
            editText: fileNode.content || ''
          };
          output = `Editing "${actualEditFileName}". Type :w to save, :q to quit.`;
        } else {
          output = `Error: File "${editFileNameArg}" not found for editing or is a directory.`;
        }
        newFileSystemInstance = undefined;
      }
      break;
    case 'reset':
      shouldResetTerminal = true;
      output = "Terminal has been reset to default settings. localStorage cleared.";
      newFileSystemInstance = undefined;
      break;
    case 'clear':
      shouldClearHistory = true;
      output = '';
      newFileSystemInstance = undefined;
      break;
    case 'history':
      if (history.length === 0) {
          output = "No commands in history.";
      } else {
          output = (
              <ul className="list-none p-0 m-0">
                  {history.map((entry: { command: string; output: React.ReactNode; path: string }, index: number) => (
                      <li key={index}>{`${index + 1}  ${entry.command}`}</li>
                  ))}
              </ul>
          );
      }
      newFileSystemInstance = undefined;
      break;
    case 'help':
      output = (
        <div className="text-xs">
          <p className="font-semibold mb-1">Available commands:</p>
          <ul className="list-none pl-1 space-y-0.5">
            <li><span className="text-amber-400 w-32 inline-block">mkdir {"<dir>"}</span> - Create directory</li>
            <li><span className="text-amber-400 w-32 inline-block">ls {"[path]"}</span> - List content</li>
            <li><span className="text-amber-400 w-32 inline-block">cd {"<path>"}</span> - Change directory</li>
            <li><span className="text-amber-400 w-32 inline-block">pwd</span> - Print working directory</li>
            <li><span className="text-amber-400 w-32 inline-block">cat {"<file>"}</span> - Display file content</li>
            <li><span className="text-amber-400 w-32 inline-block">touch {"<file>"}</span> - Create an empty file</li>
            <li><span className="text-amber-400 w-32 inline-block">rm {"<item>"}</span> - Remove file or empty directory</li>
            <li><span className="text-amber-400 w-32 inline-block">edit {"<file>"}</span> - Edit a text file</li>
            <li><span className="text-amber-400 w-32 inline-block">reset</span> - Reset terminal to defaults</li>
            <li><span className="text-amber-400 w-32 inline-block">clear</span> - Clear terminal</li>
            <li><span className="text-amber-400 w-32 inline-block">history</span> - Show command history</li>
            <li><span className="text-amber-400 w-32 inline-block">help</span> - Show this message</li>
          </ul>
          <p className="mt-1 text-gray-500">Paths can be relative (e.g. `mydir`, `../otherdir`) or absolute (e.g. `/home/user`).</p>
        </div>
      );
      newFileSystemInstance = undefined;
      break;
    case '':
      newFileSystemInstance = undefined;
      break; 
    default:
      output = `Command not found: ${command}. Type 'help' for available commands.`;
      newFileSystemInstance = undefined;
  }

  return {
    output,
    newPath,
    newFileSystem: newFileSystemInstance,
    enterEditMode,
    exitEditMode,
    shouldClearHistory,
    shouldResetTerminal,
    clearCommandInput: !enterEditMode
  };
}; 