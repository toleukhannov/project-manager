// libraries
import type { FC } from 'react';
// components
import { H2 } from '@blueprintjs/core';
// hooks
import {
  useDroppable,
} from '@dnd-kit/core';
import { DraggableCard } from 'components/Project/DraggableCard';

import type { Task } from 'store/services/task/taskApi';

export const DroppableColumn: FC<{
  status: string;
  tasks: Task[];
  className: string;
}> = ({ status, tasks, className }) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div ref={setNodeRef} className={className}>
      <H2 className={`${className}-heading`}>{status.toUpperCase()}</H2>
      {tasks.map((task) => (
        <DraggableCard key={task.id} task={task} />
      ))}
    </div>
  );
};
