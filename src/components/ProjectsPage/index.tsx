// libraries
import { type FC, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
// components
import {
  Button,
  H1,
  InputGroup,
  Spinner,
} from '@blueprintjs/core';
import Header from 'components/Header';
import ProjectsList from 'components/ProjectsList';
import ModalButton from 'components/shared/ModalButton';
// config
import { ITEMS_PER_PAGE } from 'components/ProjectsPage/config';
// types
import type { ProjectFormInputProps } from 'components/LoginPage/types';

// rtk query
import { useCreateProjectMutation, useGetProjectsQuery } from 'store/services/project/projectApi';

const ProjectsPage: FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProjectFormInputProps>();

  const { data: allProjects, isLoading, refetch } = useGetProjectsQuery();
  const [createProject] = useCreateProjectMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const onSubmit = async (data: ProjectFormInputProps, close: () => void) => {
    try {
      const payload = {
        ...data,
        createdAt: new Date().toISOString(),
      };

      await createProject(payload);
      toast.success('Успешно создан проект');
      await refetch();
      reset();
      close();
    } catch (err) {
      toast.error('Ошибка при создании проекта:', err);
    }
  };

  const filteredProjects = useMemo(() => {
    if (!allProjects) {
      return [];
    }

    return allProjects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allProjects, searchTerm]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <div className="container">
      <Toaster />
      <Header />

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
        <InputGroup
          leftIcon="search"
          onChange={handleSearchChange}
          placeholder="Поиск проекта по названию..."
          value={searchTerm}
        />

        <ModalButton buttonText="Создать проект">
          {(close) => (
            <form onSubmit={handleSubmit((data) => onSubmit(data, close))}>
              <H1 className="modal-heading">Создание проекта</H1>

              <Controller
                control={control}
                defaultValue=""
                name="name"
                render={({ field }) => (
                  <InputGroup className="modal-input" placeholder="Название проекта" {...field} />
                )}
                rules={{ required: 'Project name is required' }}
              />
              {errors.name && <span>{errors.name.message}</span>}

              <Controller
                control={control}
                defaultValue=""
                name="description"
                render={({ field }) => (
                  <InputGroup className="modal-input" placeholder="Описание проекта" {...field} />
                )}
                rules={{ required: 'Description is required' }}
              />
              {errors.description && <span>{errors.description.message}</span>}

              <Button intent="primary" text="Создать" type="submit" />
            </form>
          )}
        </ModalButton>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <ProjectsList projects={paginatedProjects} />

          {totalPages > 1 && (
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16,
          }}
          >
            <Button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Назад
            </Button>
            <div style={{ paddingTop: 6 }}>
              Страница
              {' '}
              {page}
              {' '}
              из
              {' '}
              {totalPages}
            </div>
            <Button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Вперёд
            </Button>
          </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsPage;
