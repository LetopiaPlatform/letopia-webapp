interface ProjectCardProps {
  title: string;
  projectName: string;
  memberCount: number;
  description: string;
  tags: string[];
  projectUrl?: string | null;
}

export function ProjectCard({
  title,
  projectName,
  memberCount,
  description,
  tags,
  projectUrl,
}: ProjectCardProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white border border-border">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-semibold text-sm sm:text-base text-[#261A2B] line-clamp-1">
            {title}
          </span>
          <span className="text-xs text-[#867D8A]">
            {projectName} · {memberCount} members
          </span>
        </div>
        {projectUrl && (
          <a href={projectUrl} target="_blank" rel="noopener noreferrer">
            <img src="/icons/external-link.svg" />
          </a>
        )}
      </div>

      <p className="text-xs sm:text-sm text-[#67537C] font-light line-clamp-2 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-[#867D8A]">Technologies</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-xs text-primary bg-[#F6F5F6] border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
