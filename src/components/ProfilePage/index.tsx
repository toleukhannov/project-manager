// libraries
import type { FC } from 'react';
// components
import { Card } from '@blueprintjs/core';
import Header from 'components/Header';

import { useGetTasksByUserIdQuery } from 'store/services/task/taskApi';
// import ModalButton from 'components/shared/ModalButton';

const ProfilePage: FC = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { data: tasks } = useGetTasksByUserIdQuery(user.id);

  return (

    <div className="container">
      <Header />
      <div className="secondary-text">
        <img alt="profile-img" />
        <p>
          Имя пользователя:
          {' '}
          {user.name}
        </p>
        {/* <ModalButton buttonText="Редактировать" /> */}
      </div>
      <div className="secondary-text">
        <p>
          Email:
          {' '}
          {user.email}
        </p>
        <p>
          Смена пароля:
          {' '}
          user.email
        </p>
      </div>
      <div className="secondary-text">
        Задачи
        {tasks?.map((task) => (
          <Card key={task.id} content={task.title} style={{ background: '#000' }}>{task.title}</Card>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
