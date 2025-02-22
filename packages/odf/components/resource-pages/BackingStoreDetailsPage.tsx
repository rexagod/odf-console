import * as React from 'react';
import { CEPH_STORAGE_NAMESPACE } from '@odf/shared/constants';
import DetailsPage from '@odf/shared/details-page/DetailsPage';
import { SectionHeading } from '@odf/shared/heading/page-heading';
import { useDeepCompareMemoize } from '@odf/shared/hooks/deep-compare-memoize';
import { Kebab } from '@odf/shared/kebab/kebab';
import { useModalLauncher } from '@odf/shared/modals/modalLauncher';
import { K8sResourceKind } from '@odf/shared/types';
import { referenceForModel } from '@odf/shared/utils';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { NooBaaBackingStoreModel } from '../../models';
import { BackingStoreKind } from '../../types';
import {
  CommonDetails,
  YAMLEditorWrapped,
  EventStreamWrapped,
} from './CommonDetails';
import ProviderDetails from './Providers';

type BackingStoreDetilsPageProps = {
  match: RouteComponentProps<{ resourceName: string; plural: string }>['match'];
};

type DetailsProps = {
  obj: BackingStoreKind;
};

type DetailsType = (launchModal: any, t) => React.FC<DetailsProps>;

const BSDetails: DetailsType =
  (launchModal, t) =>
  // eslint-disable-next-line react/display-name
  ({ obj }) => {
    return (
      <CommonDetails
        launchModal={launchModal}
        resourceModel={NooBaaBackingStoreModel}
        resource={obj}
      >
        <SectionHeading text={t('Provider details')} />
        <div className="row">
          <div className="col-sm-6">
            <ProviderDetails resource={obj} />
          </div>
        </div>
      </CommonDetails>
    );
  };

const BackingStoreDetailsPage: React.FC<BackingStoreDetilsPageProps> = ({
  match,
}) => {
  const { t } = useTranslation('plugin__odf-console');
  const { resourceName: name } = match.params;
  const [resource, loaded, loadError] = useK8sWatchResource<K8sResourceKind>({
    kind: referenceForModel(NooBaaBackingStoreModel),
    name,
    namespace: CEPH_STORAGE_NAMESPACE,
    isList: false,
  });

  const [Modal, modalProps, launchModal] = useModalLauncher();

  const breadcrumbs = [
    {
      name: t('OpenShift Data Foundation'),
      path: '/odf/overview',
    },
    {
      name: t('BackingStores'),
      path: '/odf/resource/noobaa.io~v1alpha1~BackingStore',
    },
    {
      name: t('BackingStore details'),
      path: '',
    },
  ];

  const Details = React.useMemo(
    () => BSDetails(launchModal, t),
    [launchModal, t]
  );

  const memoizedResource = useDeepCompareMemoize(resource, true);

  const actions = React.useCallback(() => {
    return (
      <Kebab
        toggleType="Dropdown"
        launchModal={launchModal}
        extraProps={{
          resource: memoizedResource,
          resourceModel: NooBaaBackingStoreModel,
        }}
      />
    );
  }, [launchModal, memoizedResource]);

  return (
    <>
      <Modal {...modalProps} />
      <DetailsPage
        loaded={loaded}
        loadError={loadError}
        breadcrumbs={breadcrumbs}
        actions={actions}
        resourceModel={NooBaaBackingStoreModel}
        resource={resource}
        pages={[
          {
            href: '',
            name: 'Details',
            component: Details as any,
          },
          {
            href: 'yaml',
            name: 'YAML',
            component: YAMLEditorWrapped,
          },
          {
            href: 'events',
            name: 'Events',
            component: EventStreamWrapped,
          },
        ]}
      />
    </>
  );
};

export default BackingStoreDetailsPage;
