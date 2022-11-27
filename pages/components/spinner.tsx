import { ILoader } from "../interface/index";
const Spinner = (props: ILoader) => <div className={`loader-${props.size}`}></div>;

export default Spinner;