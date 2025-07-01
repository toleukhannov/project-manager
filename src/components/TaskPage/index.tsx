// libraries
import type { FC } from 'react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import {
  AiOutlineArrowLeft,
} from 'react-icons/ai';
import { Link, useNavigate, useParams } from 'react-router-dom';
// components
import {
  Button, H1, H2, MenuItem,
} from '@blueprintjs/core';
import { type ItemRenderer, Select } from '@blueprintjs/select';
import CommentsList from 'components/CommentsList';
import Loading from 'components/shared/Loading';
import ModalButton from 'components/shared/ModalButton';
import { STATUS_CONFIG } from 'components/Project/config';
// helpers
import { formattedDate } from 'helpers/formattedDate';
// types
import type { TaskFormInputProps } from 'components/LoginPage/types';

// rtk query
import {
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
} from 'store/services/task/taskApi';

const TaskPage: FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TaskFormInputProps>();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: task,
    isLoading,
    isError,
  } = useGetTaskByIdQuery(id!, {
    skip: !id,
  });

  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  useEffect(() => {
    if (task) {
      reset(task);
    }
  }, [task, reset]);

  const handleDelete = async (close: () => void) => {
    try {
      if (!task?.id) {
        return;
      }
      await deleteTask({ taskId: task.id }).unwrap();
      toast.success('Задача успешно удалена');
      close();
      navigate(`/projects/${task.projectId}`);
    } catch (error) {
      toast.error('Ошибка при удалении задачи:', error);
    }
  };

  const handleUpdate = async (
    data: TaskFormInputProps,
    close: () => void,
  ) => {
    try {
      if (!task?.id) {
        return;
      }

      await updateTask({ id: task.id, ...data }).unwrap();
      toast.success('Задача успешно обновлена');
      close();
    } catch (error) {
      toast.error('Ошибка при обновлении задачи:', error);
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

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (isError || !task) {
    return <div>Задача не найдена</div>;
  }

  return (
    <div className="container">
      <Toaster />
      <div>
        <div className="flex-container">
          <Link to={`/projects/${task.projectId}`}>
            <AiOutlineArrowLeft className="svg-icon" />
          </Link>
          <H1>{task.title}</H1>
        </div>
        <div className="flex-container">
          <ModalButton buttonText="Изменить статус">
            {(close) => (
              <form onSubmit={handleSubmit((data) => handleUpdate(data, close))}>
                <H2>Выберите статус</H2>
                <Controller
                  control={control}
                  defaultValue={task.status}
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
                {errors.status && (
                <div className="error">{errors.status.message}</div>
                )}
                <div style={{ marginTop: '1rem' }}>
                  <Button intent="primary" text="Сохранить" type="submit" />
                </div>
              </form>
            )}
          </ModalButton>

          <ModalButton buttonText="Удалить">
            {(close) => (
              <>
                <H2>
                  Вы действительно хотите удалить задание
                  {' '}
                  <strong>{task.title}</strong>
                  ?
                </H2>
                <Button
                  intent="danger"
                  onClick={() => handleDelete(close)}
                  text="Удалить"
                />
              </>
            )}
          </ModalButton>
        </div>
      </div>

      <div>
        <p className="secondary-text">
          <b>Описание задачи:</b>
          {' '}
          {task.description || 'Нету описаний'}
        </p>
        <p className="secondary-text">
          <b>Исполнитель:</b>
          {' '}
          {task.assignee}
        </p>
        <p className="secondary-text">
          <b>Дедлайн:</b>
          {' '}
          {formattedDate(task.deadline)}
        </p>
      </div>
      <CommentsList />
    </div>
  );
};

export default TaskPage;
