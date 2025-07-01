// libraries
import type { FC } from 'react';
// static
import { AiOutlineDoubleRight } from 'react-icons/ai';
import { Link } from 'react-router-dom';
// components
import { Card } from '@blueprintjs/core';
// hooks
import { useDraggable } from '@dnd-kit/core';
// config
import { DRAGGING_OPACITY, DROPPED_OPACITY } from 'components/Project/DraggableCard/config';

// api
import type { Task } from 'store/services/task/taskApi';

export const DraggableCard: FC<{ task: Task }> = ({ task }) => {
  const {
    attributes, listeners, setNodeRef, transform, isDragging,
  } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : null,
    opacity: isDragging ? DRAGGING_OPACITY : DROPPED_OPACITY,
    cursor: 'grab',
    marginBottom: 10,
  };

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="task-card flex-container"
      style={style}
    >
      <p className="task-title">{task.title}</p>
      <Link className="task-link" to={`tasks/${task.id}`}>
        <AiOutlineDoubleRight className="icon" />
      </Link>
    </Card>
  );
};
