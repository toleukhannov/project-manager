// libraries
import { type FC } from 'react';
// components
import ProjectsListItem from 'components/ProjectsList/Item';

type ProjectsListProps = {
  projects: {
    id: string;
    createdAt: string;
    description: string;
    name: string;
  }[];
};

const ProjectsList: FC<ProjectsListProps> = ({ projects }) => (

  <div className="projects-list">
    {projects.map((project) => (
      <ProjectsListItem
        key={project.id}
        createdAt={project.createdAt}
        description={project.description}
        id={project.id}
        name={project.name}
      />
    ))}
  </div>
);

export default ProjectsList;
