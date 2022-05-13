import SelectInput from "ink-select-input";

import { FacebookLogin } from "./pages/facebookLogin";
import { Router, useRouter } from "./util/router";

export function App() {
  return (
    <Router
      pages={[
        { component: <Menu />, key: "main" },
        { component: <FacebookLogin />, key: "facebookLogin" },
      ]}></Router>
  );
}

function Menu() {
  const router = useRouter();

  function handleSelect(item: { value: string }) {
    router.push(item.value);
  }

  return <SelectInput items={[{ label: "페이스북 로그인 테스트", value: "facebookLogin" }]} onSelect={handleSelect} />;
}
