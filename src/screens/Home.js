import { useState, useRef, useLayoutEffect } from "react";
import { Pd, Tern } from "../helpers/func";
import useResize from "../hooks/useResize";
// import Math from 'math';
import { LandingForm1, LandingForm2, LandingForm3, LandingForm4, Results } from "./HomeComponents";

const Home = () => {
    const form1 = useRef(null)
    const form2 = useRef(null)
    const form3 = useRef(null)
    const form4 = useRef(null)
    const form5 = useRef(null)

    const [choices, setChoices] = useState([])
    const [factors, setFactors] = useState([])
    const [ratingMatrix, setRatingMatrix] = useState([])

    const [stePdata, setStepData] = useState([1, 1]); // step, and maxStep

    const { breakpointSelector } = useResize();


    const onChangeForm = (e, nextStage) => { Pd(e, () => { setStepData([nextStage, Math.max(nextStage, stePdata[1])]) }) }

    useLayoutEffect(() => {
        // const options = { block: "center" };
        const options = true;
        switch (stePdata[0]) {
            case 1:
                form1.current.scrollIntoView(options);
                break;
            case 2:
                form2.current.scrollIntoView(options);
                break;
            case 3:
                form3.current.scrollIntoView(options);
                break;
            case 4:
                form4.current.scrollIntoView(options);
                break;
            default:
                form5.current.scrollIntoView(options);
        }
    }, [stePdata])

    return (
        <div>
            <div className="container">
                <div style={{ height: "10vh" }}></div>
                <div className="display-1 h1 fw-bold text-center text-primary font-title m-0">I can't decide</div>
                <p className="text-center text-muted o-50 mb-5">A Rational Helper for the Indecisive</p>
                <div style={{ width: `${breakpointSelector(100, 90, 80, 70, 60)}%`, margin: "auto" }}>
                    <div>
                        <div ref={form1} className="animated-all" style={{
                            opacity: Tern(stePdata[0] === 1, 1.0, 0.4),
                        }}>
                            <LandingForm1 upperSetChoices={setChoices} onChangeForm={onChangeForm} currentStep={stePdata[0]} />
                        </div>
                        <div ref={form2} style={{
                            opacity: Tern(stePdata[0] === 2, 1.0, 0.4),
                            display: Tern(stePdata[1] >= 2, "block", "none")
                        }}>
                            <LandingForm2 upperSetFactors={setFactors} factors={factors} onChangeForm={onChangeForm} currentStep={stePdata[0]} />
                        </div>
                        <div ref={form3} style={{
                            opacity: Tern(stePdata[0] === 3, 1.0, 0.4),
                            display: Tern(stePdata[1] >= 3, "block", "none")
                        }}>
                            <LandingForm3 upperSetFactors={setFactors} initialFactors={factors} onChangeForm={onChangeForm} currentStep={stePdata[0]} />
                        </div>
                        <div ref={form4} style={{
                            opacity: Tern(stePdata[0] === 4, 1.0, 0.4),
                            display: Tern(stePdata[1] >= 4, "block", "none")
                        }}>
                            <LandingForm4 factors={factors} choices={choices} onChangeForm={onChangeForm} currentStep={stePdata[0]} upperSetRatingMatrix={setRatingMatrix} />
                        </div>
                    </div>
                </div>
            </div>
            <div ref={form5} style={{
                opacity: Tern(stePdata[0] === 5, 1.0, 0.4),
                display: Tern(stePdata[1] >= 5, "block", "none")
            }}>
                <Results ratingMatrix={ratingMatrix} factors={factors} onChangeForm={onChangeForm} currentStep={stePdata[0]} />
            </div>
            <div style={{ height: "10vh" }}></div>
        </div>
    );
}

export default Home;