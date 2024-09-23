import { useLocalSearchParams } from "expo-router";
import StateList from "../../../../components/StateList";

const State = () => {
  const params = useLocalSearchParams();
  let state = JSON.parse(decodeURIComponent(params.state));

  return <StateList state={state} type={"home"} />;
};

export default State;
