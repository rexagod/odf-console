import * as React from 'react';
import { calcPVsCapacity } from '@odf/core/utils';
import { K8sResourceKind, StorageClassResourceKind } from '@odf/shared/types';
import { humanizeBinaryBytes } from '@odf/shared/utils/humanize';
import { useTranslation } from 'react-i18next';
import { getSCAvailablePVs } from '../../utils/ocs';
import './add-capacity-modal.scss';
import './pvs-available-capacity.scss';

export const PVsAvailableCapacity: React.FC<PVAvaialbleCapacityProps> = ({
  replica,
  storageClass,
  data,
  loaded,
  loadError,
}) => {
  const { t } = useTranslation('plugin__odf-console');

  let availableCapacity: string = '';

  let availableStatusElement = (
    <div className="skeleton-text ceph-pvs-available-capacity__current-capacity--loading" />
  );

  if (loaded && !!storageClass?.metadata?.name && !loadError) {
    const pvs = getSCAvailablePVs(data, storageClass?.metadata?.name);
    availableCapacity = humanizeBinaryBytes(calcPVsCapacity(pvs)).string;
    availableStatusElement = (
      <div>
        {t('{{availableCapacity}} /  {{replica}} replicas', {
          availableCapacity,
          replica,
        })}
      </div>
    );
  } else if (loaded || loadError) {
    availableStatusElement = (
      <div className="text-muted">{t('Not Available')}</div>
    );
  }

  return (
    <div className="ceph-add-capacity__current-capacity">
      <div className="text-secondary ceph-add-capacity__current-capacity--text">
        <strong>{t('Available capacity:')}</strong>
      </div>
      {availableStatusElement}
    </div>
  );
};

type PVAvaialbleCapacityProps = {
  replica: number;
  storageClass: StorageClassResourceKind;
  data: K8sResourceKind[];
  loaded: boolean;
  loadError: any;
};
