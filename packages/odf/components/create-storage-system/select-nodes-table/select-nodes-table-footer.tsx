import * as React from 'react';
import {
  getTotalCpu,
  getTotalMemory,
  getAllZone,
} from '@odf/core/components/utils';
import { humanizeBinaryBytes } from '@odf/shared/utils';
import { useTranslation } from 'react-i18next';
import { TextContent, Text } from '@patternfly/react-core';
import { WizardNodeState } from '../reducer';

export const SelectNodesTableFooter: React.FC<SelectNodesDetailsProps> =
  React.memo(({ nodes }) => {
    const { t } = useTranslation('plugin__odf-console');

    const totalCpu = getTotalCpu(nodes);
    const totalMemory = getTotalMemory(nodes);
    const zones = getAllZone(nodes);

    return (
      <TextContent>
        <Text data-test-id="nodes-selected">
          {t('{{nodeCount, number}} node', {
            nodeCount: nodes.length,
            count: nodes.length,
          })}{' '}
          {t('selected ({{cpu}} CPU and {{memory}} on ', {
            cpu: totalCpu,
            memory: humanizeBinaryBytes(totalMemory).string,
          })}
          {t('{{zoneCount, number}} zone', {
            zoneCount: zones.size,
            count: zones.size,
          })}
          {')'}
        </Text>
      </TextContent>
    );
  });
SelectNodesTableFooter.displayName = 'SelectNodesTableFooter';

type SelectNodesDetailsProps = {
  nodes: WizardNodeState[];
};
