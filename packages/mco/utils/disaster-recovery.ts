import { getLabel, hasLabel } from '@odf/shared/selectors';
import { ApplicationKind } from '@odf/shared/types/k8s';
import {
  Operator,
  MatchExpression,
} from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';
import { ODF_MINIMUM_SUPPORT } from '../constants/dr-policy';
import { ACMSubscriptionKind } from '../types';

export const isMinimumSupportedODFVersion = (odfVersion: string): boolean =>
  odfVersion.localeCompare(ODF_MINIMUM_SUPPORT, undefined, {
    numeric: true,
    sensitivity: 'base',
  }) >= 0;

const isSubscriptionInApplication = (
  subscription: ACMSubscriptionKind,
  expr: MatchExpression,
  match: Boolean
) =>
  match
    ? expr?.values?.includes(getLabel(subscription, expr?.key))
    : !expr?.values?.includes(getLabel(subscription, expr?.key));

const isApplicationInSubscription = (
  subscription: ACMSubscriptionKind,
  expr: MatchExpression,
  match: Boolean
) =>
  match
    ? hasLabel(subscription?.metadata?.labels, expr?.key) &&
      !Array.isArray(expr?.values)
    : !hasLabel(subscription?.metadata?.labels, expr?.key) &&
      !Array.isArray(expr?.values);

export const matchApplicationsToSubstring = (
  subscription: ACMSubscriptionKind,
  application: ApplicationKind
): boolean => {
  // applying subscription filter from application
  const valid = application?.spec?.selector?.matchExpressions?.every((expr) => {
    switch (expr?.operator) {
      case Operator.In:
        return isSubscriptionInApplication(subscription, expr, true);
      case Operator.NotIn:
        return isSubscriptionInApplication(subscription, expr, false);
      case Operator.Exists:
        return isApplicationInSubscription(subscription, expr, true);
      case Operator.DoesNotExist:
        return isApplicationInSubscription(subscription, expr, false);
        break;
      default:
        return false;
    }
  });
  return valid;
};
