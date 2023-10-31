export interface IProps {
  module: string[] | string;
  children?: React.ReactNode;
  noPermissionNode?: React.ReactNode;
}
function PermissionBlock(props: IProps) {
  const { children, module, noPermissionNode = null } = props;
  const myPermission = JSON.parse(sessionStorage.getItem('permissions') ?? '') as string[];
  console.log(myPermission);
  const checkHasPermission = (): boolean => {
    return myPermission.some((x: string) => module.includes(x));
  };

  return <>{checkHasPermission() ? children : noPermissionNode}</>;
}

export default PermissionBlock;
