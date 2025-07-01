// libraries
import { type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
// static
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Link, useNavigate, useParams } from 'react-router-dom';
// components
import {
  Button, H2, InputGroup, MenuItem,
} from '@blueprintjs/core';
import { type ItemRenderer, Select } from '@blueprintjs/select';
import {
  closestCenter,
  DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { DroppableColumn } from 'components/Project/DroppableColumn';
import Loading from 'components/shared/Loading';
import ModalButton from 'components/shared/ModalButton';
// config
import { STATUS_CONFIG } from 'components/Project/config';
// helpers
import { formattedDate } from 'helpers/formattedDate';
// styles
import cls from 'components/Project/Project.module.scss';

// rtk query
import { useDeleteProjectMutation, useGetProjectByIdQuery } from 'store/services/project/projectApi';
import { useAddTaskMutation, useGetTasksByProjectIdQuery, useUpdateTaskMutation } from 'store/services/task/taskApi';
import { useGetUsersQuery, type User } from 'store/services/user/userApi';

type TaskFormInputProps = {
  projectId: string;
  title: string;
  status: string;
  assignee: string;
  deadline: string;
  description: string;
};

const Project: FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TaskFormInputProps>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [addTask] = useAddTaskMutation();
  const { refetch } = useGetTasksByProjectIdQuery(id!, {
    skip: !id,
  });
  const sensors = useSensors(useSensor(PointerSensor));

  const {
    data: project,
    isLoading,
    isError,
  } = useGetProjectByIdQuery(id!, {
    skip: !id,
  });

  const {
    data: tasks = [],
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useGetTasksByProjectIdQuery(id!, {
    skip: !id,
  });

  const { data: users } = useGetUsersQuery();

  const [deleteProject] = useDeleteProjectMutation();
  const [updateTask] = useUpdateTaskMutation();

  const handleDelete = async (close: () => void) => {
    try {
      if (!project?.id) {
        return;
      }

      await deleteProject(project.id).unwrap();
      toast.success('Проект был удален');
      close();
      navigate('/projects');
    } catch (error) {
      toast.error('Ошибка при удалении проекта:', error);
    }
  };

  const onSubmit = async (data: TaskFormInputProps, close: () => void) => {
    try {
      await addTask({
        ...data,
        projectId: id,
      }).unwrap();
      await refetch();
      toast.success('Задача успешно добавлена');
      reset();
      close();
    } catch (err) {
      toast.error('Ошибка при добавлении задачи:', err);
    }
  };

  if (isLoading || isTasksLoading) {
    return (
      <Loading />
    );
  }

  if (isError || !project) {
    return <div>Проект не найден</div>;
  }
  if (isTasksError || !tasks) {
    return <div>Задачи не найдены</div>;
  }

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over || active.id === over.id) {
      return;
    }

    const task = tasks.find((t) => t.id === active.id);

    if (!task) {
      return;
    }

    try {
      await updateTask({
        ...task,
        status: over.id as string,
      }).unwrap();

      refetch();
    } catch (err) {
      toast.error('Ошибка при смене статуса задачи:', err);
    }
  };

  const renderStatus: ItemRenderer<string> = (
    status,
    { handleClick, modifiers, index },
  ) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    return (
      <MenuItem
        key={index}
        active={modifiers.active}
        onClick={handleClick}
        roleStructure="listoption"
        text={status}
      />
    );
  };

  const renderUsers: ItemRenderer<User> = (
    user,
    { handleClick, modifiers, index },
  ) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    return (
      <MenuItem
        key={index}
        active={modifiers.active}
        onClick={handleClick}
        roleStructure="listoption"
        text={user.name}
      />
    );
  };

  return (
    <div className="container">
      <Toaster />
      <div className="info-block">
        <div>
          <div className="flex-container">
            <Link to="/projects"><AiOutlineArrowLeft className="svg-icon" /></Link>
            <H2 className="project-name">{project.name}</H2>
          </div>
          <p className="project-description">{project.description}</p>
          <p className="project-created">
            Дата создания:
            {' '}
            {formattedDate(project.createdAt)}
          </p>
        </div>

        <ModalButton buttonText="Удалить проект">
          {(close) => (
            <>
              <H2 className="modal-heading">
                Вы действительно хотите удалить проект
                {' '}
                <strong>{project.name}</strong>
                ?
              </H2>
              <Button
                className="modal-button"
                intent="danger"
                onClick={() => handleDelete(close)}
                text="Удалить"
              />
            </>
          )}
        </ModalButton>
      </div>
      <ModalButton buttonText="Добавить задание">
        {(close) => (
          <form onSubmit={handleSubmit((data) => onSubmit(data, close))}>
            <H2 className="modal-heading">Добавить задание</H2>

            <Controller
              control={control}
              defaultValue=""
              name="title"
              render={({ field }) => (
                <InputGroup className="modal-input" placeholder="Название задачи" {...field} />
              )}
              rules={{ required: 'Введите название задачи' }}
            />
            {errors.title && <span>{errors.title.message}</span>}

            <Controller
              control={control}
              defaultValue="todo"
              name="status"
              render={({ field }) => (
                <Select<string>
                  itemRenderer={renderStatus}
                  items={STATUS_CONFIG}
                  noResults={<MenuItem disabled text="Нет результатов" />}
                  onItemSelect={field.onChange}
                  popoverProps={{ minimal: true }}
                >
                  <Button
                    className="modal-input"
                    text={field.value || 'Выберите статус'}
                  />
                </Select>
              )}
              rules={{ required: 'Введите статус' }}
            />
            {errors.status && <span>{errors.status.message}</span>}

            <Controller
              control={control}
              defaultValue=""
              name="deadline"
              render={({ field }) => (
                <InputGroup className="modal-input" placeholder="Статус (todo / in-progress / done)" type="date" {...field} />
              )}
              rules={{ required: 'Введите дедлайн' }}
            />
            {errors.deadline && <span>{errors.deadline.message}</span>}

            <Controller
              control={control}
              defaultValue=""
              name="assignee"
              render={({ field }) => {
                const selectedUser = users.find((u) => u.id === field.value);

                return (
                  <Select<User>
                    itemPredicate={(query, user) => user.name.toLowerCase().includes(query.toLowerCase())}
                    itemRenderer={renderUsers}
                    items={users}
                    noResults={<MenuItem disabled text="Нет результатов" />}
                    onItemSelect={(user) => field.onChange(user.id)}
                    popoverProps={{ minimal: true }}
                  >
                    <Button
                      className="modal-input"
                      text={selectedUser?.name || 'Присвоить'}
                    />
                  </Select>
                );
              }}
              rules={{ required: 'Выберите исполнителя' }}
            />

            {errors.status && <span>{errors.status.message}</span>}

            <Button intent="primary" text="Добавить" type="submit" />
          </form>
        )}
      </ModalButton>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <div className={cls.statusColumnsWrapper}>
          {STATUS_CONFIG.map((status) => (
            <DroppableColumn key={status} className={`${status}-column`} status={status} tasks={tasks.filter((t) => t.status === status)} />
          ))}
        </div>
      </DndContext>

    </div>
  );
};

export default Project;
