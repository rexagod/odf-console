import { K8sKind } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

// This model is used by HorizontalNav to limit the exposure of tabs to ODF Dashboard
export const ODFStorageSystemMock: K8sKind = {
  label: 'StorageSystem',
  labelPlural: 'StorageSystems',
  apiVersion: 'v1',
  apiGroup: 'console.odf.io',
  plural: 'storagesystems',
  abbr: 'SS',
  namespaced: true,
  kind: 'StorageSystem',
  crd: true,
};

export const IBMFlashSystemModel: K8sKind = {
  label: 'IBM Flash System',
  labelPlural: 'IBM Flash Systems',
  apiVersion: 'v1alpha1',
  apiGroup: 'odf.ibm.com',
  plural: 'flashsystemclusters',
  abbr: 'FS',
  namespaced: true,
  kind: 'FlashSystemCluster',
  crd: true,
};
