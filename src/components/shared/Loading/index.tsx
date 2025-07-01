// libraries
import type { FC } from 'react';
// components
import { ProgressBar } from '@blueprintjs/core';

const Loading: FC = () => (
  <div>
    Загрузка...
    <ProgressBar />
  </div>
);

export default Loading;
