// libraries
import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button, H1, InputGroup } from '@blueprintjs/core';
// styles
import cls from 'components/LoginPage/LoginPage.module.scss';
// types
import type { LoginFormInputProps } from 'components/LoginPage/types';

const LoginPage: FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormInputProps>();

  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputProps) => {
    const res = await fetch(`http://local host:3000/users?email=${data.email}&password=${data.password}`);
    const users = await res.json();

    if (users.length) {
      const user = users[0];

      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Успешный логин');
      navigate('/projects');
    } else {
      toast.error('Неверный логин или пароль');
    }
  };

  return (
    <div className={cls.loginPageWrapper}>
      <Toaster />
      <div className={cls.formWrapper}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <H1>Login</H1>
          <Controller
            control={control}
            defaultValue=""
            name="email"
            render={({ field }) => (
              <InputGroup placeholder="email" {...field} />
            )}
            rules={{ required: 'Email is required' }}
          />
          {errors.email && <span>{errors.email.message}</span>}

          <Controller
            control={control}
            defaultValue=""
            name="password"
            render={({ field }) => (
              <InputGroup placeholder="password" type="password" {...field} />
            )}
            rules={{ required: 'Password is required' }}
          />
          {errors.password && <span>{errors.password.message}</span>}

          <Button intent="primary" text="Login" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
