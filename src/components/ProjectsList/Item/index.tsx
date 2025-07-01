// libraries
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
// components
import { Card, H2 } from '@blueprintjs/core';
// config
import { formattedDate } from 'helpers/formattedDate';

interface ProjectsListItemProps {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const ProjectsListItem: FC<ProjectsListItemProps> = ({
  id, name, description, createdAt,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${id}`);
  };

  return (
    <Card className="projects-list-item" interactive onClick={handleClick}>
      <H2 className="project-title">{name}</H2>
      <div className="project-info">
        <p className="description">{description}</p>
        <p className="created-date">{formattedDate(createdAt)}</p>
      </div>
    </Card>
  );
};

export default ProjectsListItem;
