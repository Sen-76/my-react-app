import { createContext, useContext, useState } from 'react';

export interface IContext {
  isLoading: boolean;
  showLoading: VoidFunction;
  closeLoading: VoidFunction;
}

export interface IProps {
  children?: React.ReactNode;
}

export const LoadingContext = createContext<IContext>({
  isLoading: false,
  showLoading: () => 1,
  closeLoading: () => 1
});

export const LoadingProvider = (props: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const showLoading = () => {
    setLoading(true);
  };
  const closeLoading = () => {
    setLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading: loading, showLoading, closeLoading }}>
      {props.children}
    </LoadingContext.Provider>
  );
};

export const LoadingConsumer = LoadingContext.Consumer;

export const useLoading = () => useContext(LoadingContext);
