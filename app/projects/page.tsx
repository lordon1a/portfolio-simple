"use client"

import { useState, useEffect } from "react"
import { Github, Link as LinkIcon, Star, Grid, List, SortDesc } from "lucide-react"

export const dynamic = 'force-dynamic'

interface GitHubRepo {
  fullName: string;
  stars: number;
  description: string | null;
  language: string | null;
  url: string;
}

export default function ProjectsPage() {
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortOrder, setSortOrder] = useState<"stars" | "recent">("stars");

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch('/api/github-stars');
        if (!response.ok) throw new Error('Failed to fetch repositories');
        const data = await response.json();
        setGithubRepos(data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, []);

  // Manual project list intentionally left empty
  const projects: Array<{
    id: string;
    title: string;
    year: string;
    description: string;
    tags: string[];
    github?: string;
    link?: string;
  }> = [];

  // Get GitHub data for a project
  const getGitHubData = (projectGithub: string | undefined) => {
    if (!projectGithub) return null;
    const repoName = projectGithub.replace('https://github.com/', '').toLowerCase();
    return githubRepos.find(repo => repo.fullName === repoName);
  };

  // Combine manual projects with GitHub repos
  const allProjects = [...projects];
  
  // Add GitHub repos that are not already in the projects list
  if (!isLoading) {
    githubRepos.forEach(repo => {
      const alreadyExists = projects.some(p => p.github && p.github.toLowerCase().includes(repo.fullName));
      if (!alreadyExists) {
        allProjects.push({
          id: repo.fullName.split('/')[1],
          title: repo.fullName.split('/')[1],
          year: new Date().getFullYear().toString(),
          description: repo.description || 'No description available',
          tags: [repo.language || 'unknown'],
          github: repo.url,
          link: '',
        });
      }
    });
  }

  // Function to toggle view mode
  const toggleViewMode = () => {
    setViewMode(prev => prev === "list" ? "grid" : "list");
  };

  // Toggle sort order between stars and recent
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "stars" ? "recent" : "stars");
  };

  // Sort projects based on sort order
  const sortedProjects = [...allProjects].sort((a, b) => {
    if (sortOrder === "stars") {
      const aStars = getGitHubData(a.github)?.stars || 0;
      const bStars = getGitHubData(b.github)?.stars || 0;
      return bStars - aStars;
    } else {
      // Recent - sort by year descending
      return parseInt(b.year) - parseInt(a.year);
    }
  });

  return (
    <section 
      className="font-mono"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-amber-400 mr-2">$</span>
          <h1 className="text-lg font-semibold tracking-tight">
            find ./projects -type f | sort
          </h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleViewMode}
            className="bg-gray-800 text-gray-400 hover:text-amber-400 p-1.5 rounded transition-all"
            title={viewMode === "list" ? "Switch to grid view" : "Switch to list view"}
          >
            {viewMode === "list" ? <Grid size={14} /> : <List size={14} />}
          </button>
          <button 
            onClick={toggleSortOrder}
            className={`bg-gray-800 p-1.5 rounded transition-all flex items-center gap-1 ${sortOrder === "stars" ? "text-amber-400" : "text-gray-400 hover:text-amber-400"}`}
            title={sortOrder === "stars" ? "Sorted by stars" : "Sorted by recent"}
          >
            <SortDesc size={14} />
            {sortOrder === "stars" ? (
              <Star size={10} className="mt-0.5" />
            ) : (
              <span className="text-[10px] mt-0.5">year</span>
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-400">loading repositories...</p>
        </div>
      ) : (
        <>
          {viewMode === "list" ? (
            <div className="grid grid-cols-1 gap-3">
              {sortedProjects.map((project) => {
                const githubData = getGitHubData(project.github);
                
                return (
                  <div 
                    key={project.id}
                    className="bg-gray-900 p-3 rounded-md border border-gray-800 hover:border-gray-700 transition-all"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-gray-300 text-sm">{project.title}</h3>
                      <div className="flex items-center gap-2">
                        {githubData && (
                          <span className="flex items-center text-[10px] bg-gray-800 text-amber-400 px-1.5 py-0.5 rounded">
                            <Star className="h-2.5 w-2.5 mr-0.5" />
                            {githubData.stars}
                          </span>
                        )}
                        <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                          {project.year}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mb-2 leading-snug">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={`${project.id}-${tag}`}
                            className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        {project.github && (
                          <a 
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 text-sm hover:underline flex items-center"
                          >
                            <Github className="h-3 w-3" />
                          </a>
                        )}
                        {project.link && (
                          <a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 text-sm hover:underline flex items-center"
                          >
                            <LinkIcon className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sortedProjects.map((project) => {
                const githubData = getGitHubData(project.github);
                
                return (
                  <div 
                    key={project.id}
                    className="bg-gray-900 p-2.5 rounded-md border border-gray-800 hover:border-gray-700 transition-all h-full flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-gray-300 text-xs">{project.title}</h3>
                      <div className="flex items-center gap-1.5">
                        {githubData && (
                          <span className="flex items-center text-[10px] bg-gray-800 text-amber-400 px-1 py-0.5 rounded">
                            <Star className="h-2 w-2 mr-0.5" />
                            {githubData.stars}
                          </span>
                        )}
                        <span className="text-[10px] bg-gray-800 text-gray-400 px-1 py-0.5 rounded">
                          {project.year}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-[10px] mb-1.5 flex-grow leading-snug">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span 
                            key={`${project.id}-${tag}`}
                            className="text-[10px] bg-gray-800 text-gray-400 px-1 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 2 && (
                          <span className="text-[10px] bg-gray-800 text-gray-400 px-1 py-0.5 rounded">
                            +{project.tags.length - 2}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        {project.github && (
                          <a 
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 text-sm hover:underline flex items-center"
                          >
                            <Github className="h-2.5 w-2.5" />
                          </a>
                        )}
                        {project.link && (
                          <a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 text-sm hover:underline flex items-center"
                          >
                            <LinkIcon className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <div className="mt-6 text-gray-500 text-xs border-t border-gray-800 pt-4">
        <p>
          <span className="text-amber-400">tip:</span> most projects are open-source. feel free to check out the source code and contribute.
        </p>
      </div>
    </section>
  )
} 