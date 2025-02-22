import * as React from 'react';
import { useTranslation } from 'react-i18next';

export const LoadingComponent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <span
      className="pf-c-spinner"
      role="progressbar"
      aria-valuetext={t('Loading...')}
    >
      <span className="pf-c-spinner__clipper" />
      <span className="pf-c-spinner__lead-ball" />
      <span className="pf-c-spinner__tail-ball" />
    </span>
  );
};
