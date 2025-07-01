import type { FC } from 'react';
import { formattedDate } from 'helpers/formattedDate';

import { useGetUserByIdQuery } from 'store/services/user/userApi';

interface CommentsListItemProps {
  data: {
    id: string;
    taskId: string;
    author: string;
    text: string;
    createdAt: string;
  };
}

const CommentsListItem: FC<CommentsListItemProps> = (props) => {
  const { data } = props;

  const {
    data: user,
    isLoading,
    isError,
  } = useGetUserByIdQuery(data.author);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError || !user) {
    return <div>Неизвестный пользователь</div>;
  }

  return (
    <div className="comments-list-item">
      <p>
        <strong>
          {user.name}
        </strong>
        {' '}
        написал:
      </p>
      <p>{data.text}</p>
      <small className="comment-date">{formattedDate(data.createdAt)}</small>
    </div>
  );
};

export default CommentsListItem;
