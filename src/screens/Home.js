import { useState, useRef, useLayoutEffect } from "react";
import { Tern } from "../helpers/func";
import useResize from "../hooks/useResize";
// import Math from 'math';
import { LandingForm1, LandingForm2, LandingBg } from "./HomeComponents";

const Home = () => {
    const form1 = useRef(null)
    const form2 = useRef(null)
    const form3 = useRef(null)

    const { breakpointSelector } = useResize();
    const [choices, setChoices] = useState(["", ""])
    const [factors, setFactors] = useState(["", ""])
    const [stepData, setStepData] = useState([1, 1]); // step, and maxStep
    const pd = (e, func) => { e.preventDefault(); func(); }

    const onChoiceRemove = (e, i) => { pd(e, () => { setChoices(choices.filter((v, j) => j !== i)) }) }
    const onChoiceNew = (e) => { pd(e, () => { setChoices([...choices, ""]) }) }
    const onChoiceChange = (e, index) => { setChoices(choices.map((v, i) => Tern(i === index, e.target.value, choices[i]))); }

    const onFactorRemove = (e, i) => { pd(e, () => { setFactors(factors.filter((v, j) => j !== i)) }) }
    const onFactorNew = (e) => { pd(e, () => { setFactors([...factors, ""]) }) }
    const onFactorChange = (e, index) => { setFactors(factors.map((v, i) => Tern(i === index, e.target.value, factors[i]))); }

    const onChangeForm = (e, nextStage) => { pd(e, () => { setStepData([nextStage, Math.max(nextStage, stepData[1])]) }) }

    useLayoutEffect(() => {
        const options = { block: "center" };
        switch (stepData[0]) {
            case 1:
                form1.current.scrollIntoView(options);
                break;
            default:
                form2.current.scrollIntoView(options);
        }
    }, [stepData])

    console.log(stepData);

    return (
        <div>
            <div style={{ position: "absolute", zIndex: "-10", overflow: "hidden", width: "100wh", height: "100vh" }}>
                <LandingBg />
            </div>
            <div className="container">
                <div style={{ height: "10vh" }}></div>
                <div className="display-1 h1 fw-bold text-center text-primary font-title m-0">I can't decide</div>
                <p className="text-center text-muted o-50 mb-5">A Rational Helper for the Indecisive</p>
                <div style={{ width: `${breakpointSelector(100, 90, 80, 70, 60)}%`, margin: "auto" }}>
                    <div>
                        <div ref={form1} className="animated-all" style={{
                            opacity: Tern(stepData[0] === 1, 1.0, 0.4),
                        }}>
                            <LandingForm1 choices={choices} onChoiceChange={onChoiceChange} onChoiceRemove={onChoiceRemove} onChoiceNew={onChoiceNew} onChangeForm={onChangeForm} currentStep={stepData[0]} />
                        </div>
                        <div ref={form2} style={{
                            opacity: Tern(stepData[0] === 2, 1.0, 0.4),
                            display: Tern(stepData[1] >= 2, "block", "none")
                        }}>
                            <LandingForm2 factors={factors} onFactorChange={onFactorChange} onFactorRemove={onFactorRemove} onFactorNew={onFactorNew} onChangeForm={onChangeForm} currentStep={stepData[0]} />
                        </div>
                    </div>
                </div>
                <div style={{ height: "10vh" }}></div>
            </div>
        </div>
    );
}

export default Home;