import { useState } from "react";
import { maxChoices } from "../helpers/constants";
import { GenerateArray, Tern } from "../helpers/func";
import useResize from "../hooks/useResize";
import LandingBg from "./HomeComponents";

const Home = () => {
    const [choices, setChoices] = useState(["", ""])
    const { breakpointSelector } = useResize();

    const onInputChoiceChange = (e, index) => {
        const c = [...choices]
        c[index] = e.target.value
        setChoices(c);
    }

    const onButtonNewChoice = (e) => {
        e.preventDefault();
        setChoices([...choices, ""])
    }

    const onButtonRemove = (e, i) => {
        e.preventDefault();
        setChoices(choices.filter((v, j) => j !== i))
    }

    const fieldSpacer = <i className="bi bi-x-lg my-3 btn o-0 disabled" />;

    return (
        <div>
            <div style={{ position: "absolute", zIndex: "-10", overflow: "hidden", width: "100wh", height: "100vh" }}>
                <LandingBg />
            </div>
            <div className="container d-flex vh-100 flex-column justify-content-center">
                <h1 className="display-1 fst-italic fw-bold my-3">I can't decide</h1>
                <form>
                    <h3 className="text-muted">Enter your choices:</h3>
                    <div className={breakpointSelector("row justify-content-center", null, "row")}>
                        <div className={breakpointSelector("col", null, "col-6")}>
                            {
                                GenerateArray(
                                    choices.length,
                                    (index) => <div key={index} className="d-flex flex-row">
                                        <input className="d-inline-block form-control form-control-lg rounded-pill my-1" value={choices[index]} placeholder={`Enter choice ${index + 1}`} onChange={(e) => onInputChoiceChange(e, index)}></input>
                                        {
                                            Tern(index > 1,
                                                <i className="bi bi-x-lg my-3 btn" onClick={(e) => { onButtonRemove(e, index); }} />,
                                                fieldSpacer,
                                            )
                                        }
                                    </div>
                                )
                            }{
                                Tern(
                                    choices.length < maxChoices,
                                    <div className="d-flex flex-row">
                                        <button className="btn btn-outline-primary mt-1 w-100 rounded-pill" onClick={onButtonNewChoice}>Add a New Choice</button>
                                        {fieldSpacer}
                                    </div>,
                                    <div />
                                )
                            }
                            <button className="btn btn-primary btn-lg my-4 rounded-pill text-white">Next</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Home;