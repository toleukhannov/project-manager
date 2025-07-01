export type LoginFormInputProps = {
  email: string;
  password: string;
};

export type ProjectFormInputProps = {
  name: string;
  description: string;
};

export type TaskFormInputProps = {
  projectId: string;
  title: string;
  status: string;
  assignee: string;
  deadline: string;
  description: string;
};
