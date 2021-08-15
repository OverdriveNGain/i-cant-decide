import { useState } from "react";
import { Tern } from "../helpers/func";
import useResize from "../hooks/useResize";
import { LandingForm1, LandingForm2, LandingBg } from "./HomeComponents";

const Home = () => {
    const { breakpointSelector } = useResize();
    const [choices, setChoices] = useState(["", ""])
    const [factors, setFactors] = useState(["", ""])
    const pd = (e, func) => { e.preventDefault(); func(); }

    const onChoiceRemove = (e, i) => { pd(e, () => { setChoices(choices.filter((v, j) => j !== i)) }) }
    const onChoiceNew = (e) => { pd(e, () => { setChoices([...choices, ""]) }) }
    const onChoiceChange = (e, index) => { setChoices(choices.map((v, i) => Tern(i === index, e.terget.value, choices[i]))); }

    const onFactorRemove = (e, i) => { pd(e, () => { setFactors(factors.filter((v, j) => j !== i)) }) }
    const onFactorNew = (e) => { pd(e, () => { setFactors([...factors, ""]) }) }
    const onFactorChange = (e, index) => { setFactors(factors.map((v, i) => Tern(i === index, e.terget.value, factors[i]))); }

    return (
        <div>
            <div style={{ position: "absolute", zIndex: "-10", overflow: "hidden", width: "100wh", height: "100vh" }}>
                <LandingBg />
            </div>
            <div className="container">
                <div style={{ height: "25vh" }}>s</div>
                <h1 className="display-1 fst-italic fw-bold my-3 text-center text-primary">I can't decide</h1>
                <div style={{ width: `${breakpointSelector(100, 90, 80, 70, 60)}%`, margin: "auto" }}>
                    <div>
                        <LandingForm1 choices={choices} onChoiceChange={onChoiceChange} onChoiceRemove={onChoiceRemove} onChoiceNew={onChoiceNew} />
                        <LandingForm2 factors={factors} onFactorChange={onFactorChange} onFactorRemove={onFactorRemove} onFactorNew={onFactorNew} />
                    </div>
                </div>
                <div style={{ height: "25vh" }}>s</div>
            </div>
        </div>
    );
}

export default Home;