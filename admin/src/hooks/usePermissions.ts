import { useRBAC } from '@strapi/strapi/admin';


const perms = { read: [{ action: 'plugin::icon-picker.read', subject: null }] };

interface IUserPermissions {
  loading: boolean;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canPublish: boolean;
}

function usePermissions() {
  const { allowedActions, isLoading: loading } = useRBAC(perms);
  return { ...allowedActions, loading } as IUserPermissions;
}

export default usePermissions;
