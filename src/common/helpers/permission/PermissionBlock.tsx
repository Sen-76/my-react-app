import { permissionManager } from './permission';

export interface IProps {
  module: string[] | string;
  children?: React.ReactNode;
  noPermissionNode?: React.ReactNode;
}
function PermissionBlock(props: IProps) {
  const { children, module, noPermissionNode = null } = props;
  const { checkHasPermission } = permissionManager();

  return <>{checkHasPermission(module) ? children : noPermissionNode}</>;
}

export default PermissionBlock;
