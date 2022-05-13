import { createContext, ReactNode, useContext, useState } from "react";

interface RouterProps {
  pages: Array<{
    component: ReactNode;
    key: string;
  }>;
}

const RouterContext = createContext({
  currentKey: "main",
  push: (_key: string) => {
    //
  },
});

export function Router(props: RouterProps) {
  const { pages } = props;

  const [currentKey, setCurrentKey] = useState("main");

  const contextValue = {
    currentKey,
    push(key: string) {
      setCurrentKey(key);
    },
  };

  return (
    <RouterContext.Provider value={contextValue}>
      {pages.find((value) => value.key === currentKey)?.component ?? <>404</>}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const router = useContext(RouterContext);

  return {
    push(key: string) {
      router.push(key);
    },
  };
}
