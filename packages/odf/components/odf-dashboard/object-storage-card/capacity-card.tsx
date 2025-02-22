import * as React from 'react';
import CapacityCard from '@odf/shared/dashboards/capacity-card/capacity-card';
import {
  useCustomPrometheusPoll,
  usePrometheusBasePath,
} from '@odf/shared/hooks/custom-prometheus-poll';
import { ODFStorageSystem } from '@odf/shared/models';
import { humanizeBinaryBytes } from '@odf/shared/utils/humanize';
import { PrometheusResponse } from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';
import { StorageDashboard, CAPACITY_QUERIES } from '../queries';

const parseMetricData = (metric: PrometheusResponse) =>
  metric?.data?.result?.map((datum) => ({
    name: datum?.metric?.type,
    usedValue: humanizeBinaryBytes(datum?.value?.[1]),
  })) || [];

const ObjectCapacityCard: React.FC = () => {
  const { t } = useTranslation('plugin__odf-console');
  const [data, error, loading] = useCustomPrometheusPoll({
    query: CAPACITY_QUERIES[StorageDashboard.USED_CAPACITY_OBJECT],
    endpoint: 'api/v1/query' as any,
    basePath: usePrometheusBasePath(),
  });

  const dataFrames = !loading && !error ? parseMetricData(data) : [];

  return (
    <Card className="odf-capacityCard--height">
      <CardHeader>
        <CardTitle>{t('External Object Provider Used Capacity')}</CardTitle>
      </CardHeader>
      <CardBody>
        <CapacityCard
          data={dataFrames}
          relative
          showPercentage={false}
          resourceModel={ODFStorageSystem}
        />
      </CardBody>
    </Card>
  );
};

export default ObjectCapacityCard;
