export interface FileSystemNode {
  type: "folder" | "file";
  name: string;
  children?: FileSystem;
  content?: string;
}

export interface FileSystem {
  [name: string]: FileSystemNode;
}

export const initialFileSystem: FileSystem = {
  home: {
    type: "folder",
    name: "home",
    children: {
      user: {
        type: "folder",
        name: "user",
        children: {
          documents: { type: "folder", name: "documents", children: {} },
          downloads: { type: "folder", name: "downloads", children: {} },
          "README.txt": {
            type: "file",
            name: "README.txt",
            content:
              "Welcome to the terminal!\nType `help` for a list of commands.",
          },
        },
      },
    },
  },
  "root_file.txt": {
    type: "file",
    name: "root_file.txt",
    content: "This is a file in the root directory.",
  },
};

export const getCurrentDirectory = (
  path: string[],
  fs: FileSystem
): FileSystem | null => {
  let current = fs;
  for (const part of path) {
    if (
      current[part] &&
      current[part].type === "folder" &&
      current[part].children
    ) {
      current = current[part].children!;
    } else {
      return null;
    }
  }
  return current;
};

export const getNodeFromPath = (
  pathSegments: string[],
  fs: FileSystem
): FileSystemNode | null => {
  if (pathSegments.length === 0) return null;
  let currentFs = fs;
  for (let i = 0; i < pathSegments.length - 1; i++) {
    const segment = pathSegments[i];
    if (
      currentFs[segment] &&
      currentFs[segment].type === "folder" &&
      currentFs[segment].children
    ) {
      currentFs = currentFs[segment].children!;
    } else {
      return null;
    }
  }
  const targetName = pathSegments[pathSegments.length - 1];
  return currentFs[targetName] || null;
};
