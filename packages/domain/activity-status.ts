export enum ActivityStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export const toActivityStatus = (status: string): ActivityStatus =>
  status === ActivityStatus.Active ? ActivityStatus.Active : ActivityStatus.Inactive;

export const isActive = (status: ActivityStatus | string): boolean => status === ActivityStatus.Active;

export const isInactive = (status: ActivityStatus | string): boolean => status === ActivityStatus.Inactive;
