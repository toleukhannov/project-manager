import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { Button, InputGroup } from '@blueprintjs/core';
import CommentsListItem from 'components/CommentsList/Item';

import { useAddCommentMutation, useGetCommentsByTaskIdQuery } from 'store/services/comment/commentApi';

type CommentInputProps = {
  id: string;
  text: string;
  taskId: string;
};
interface CommentFormData {
  text: string;
}

const CommentsList: FC = () => {
  const { id: taskId } = useParams<{ id: string }>();
  const {
    data: comments = [],
    refetch,
  } = useGetCommentsByTaskIdQuery(taskId!, {
    skip: !taskId,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CommentInputProps>();
  const [addComment] = useAddCommentMutation();

  const user = JSON.parse(localStorage.getItem('user'));

  const onSubmit = async (data: CommentFormData) => {
    if (!taskId) {
      return;
    }

    try {
      await addComment({
        taskId,
        text: data.text,
        author: user.id,
      }).unwrap();
      refetch();

      reset();
    } catch (error) {
      toast.error('Ошибка при добавлении комментария:', error);
    }
  };

  return (
    <>
      <Toaster />
      <p className="title secondary-text">Комментарии: </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          defaultValue=""
          name="text"
          render={({ field }) => (
            <InputGroup className="modal-input" placeholder="Напишите комментарий..." type="text" {...field} />
          )}
          rules={{
            required: 'Введите текст комментария',
            minLength: { value: 1, message: 'Комментарий не может быть пустым' },
          }}
        />
        {errors.text && <span>{errors.text.message}</span>}

        <Button intent="primary" text="Создать" type="submit" />
      </form>
      <div className="comments-list secondary-text">
        {comments.map((comment) => (
          <CommentsListItem key={comment.id} data={comment} />
        ))}
      </div>

    </>
  );
};

export default CommentsList;
