import useResize from "../hooks/useResize";
import { maxChoices, maxFactors } from "../helpers/constants";
import Sketch from "react-p5";
import { GenerateArray, Tern } from "../helpers/func";

const LandingBg = (props) => {
    const setup = (p5) => {
        p5.createCanvas(window.innerWidth, window.innerHeight).parent("LandingBgParent");
    };

    const windowResized = (p5) => {
        p5.resizeCanvas(window.innerWidth, window.innerHeight);
    };

    const draw = (p5) => {
        p5.background(200, 230, 255);
    };

    return (
        <div id="LandingBgParent">
            <Sketch setup={setup} draw={draw} windowResized={windowResized} />
        </div>
    );
};

const LandingForm1 = ({ choices, onChoiceChange, onChoiceRemove, onChoiceNew }) => {
    const { breakpointSelector } = useResize();
    const fieldSpacer = <i className="bi bi-x-lg btn o-0 disabled py-2" />;
    return (
        <form className="d-block card rounded-2 shadow border-0 mb-3">
            <div className="bg-secondary rounded-top rounded-sm py-2 px-3 text-center">
                <span className="text-white">Step 1: Enter your choices</span>
            </div>
            <div className="p-3">
                <div className="row justify-content-center mt-3">
                    <div className={breakpointSelector("col", null, "col-6")}>
                        {
                            GenerateArray(
                                choices.length,
                                (index) => <div key={index} className="d-flex flex-row py-1">
                                    <input className="d-inline-block form-control form-control rounded-1" value={choices[index]} placeholder={`Enter choice ${index + 1}`} onChange={(e) => onChoiceChange(e, index)}></input>
                                    {
                                        Tern(index > 1,
                                            <button className="rounded-circle btn" onClick={(e) => { onChoiceRemove(e, index); }} >
                                                <i className="bi bi-x-lg" />
                                            </button>,
                                            fieldSpacer,
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="d-flex flex-row">
                    <button className={"mt-4 w-50 btn btn rounded-1 btn-outline-secondary" + Tern(choices.length < maxChoices, "", " disabled")} onClick={onChoiceNew}>Add a New Choice</button>
                    <span className="ps-2"></span>
                    <button className="mt-4 w-50 btn btn rounded-1 btn-primary text-white">Next</button>
                </div>
            </div>
        </form>
    );
}

const LandingForm2 = ({ factors, onFactorChange, onFactorRemove, onFactorNew }) => {
    const { breakpointSelector } = useResize();
    const fieldSpacer = <i className="bi bi-x-lg btn o-0 disabled py-2" />;

    return (
        <form className="d-block card rounded-2 shadow border-0 mb-3">
            <div className="bg-secondary rounded-top rounded-sm py-2 px-3 text-center">
                <span className="text-white">Step 2: Enter your factors</span>
            </div>
            <div className="p-3">
                <p>e.g. Price, Color, Long-Term</p>
                <div className="row justify-content-center mt-3">
                    <div className={breakpointSelector("col", null, "col-6")}>
                        {
                            GenerateArray(
                                factors.length,
                                (index) => <div key={index} className="d-flex flex-row py-1">
                                    <input className="d-inline-block form-control form-control rounded-1" value={factors[index]} placeholder={`Enter factor ${index + 1}`} onChange={(e) => onFactorChange(e, index)}></input>
                                    {
                                        Tern(index > 1,
                                            <button className="rounded-circle btn" onClick={(e) => { onFactorRemove(e, index); }} >
                                                <i className="bi bi-x-lg" />
                                            </button>,
                                            fieldSpacer,
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="d-flex flex-row">
                    <button className={"mt-4 w-50 btn btn rounded-1 btn-outline-secondary" + Tern(factors.length < maxFactors, "", " disabled")} onClick={onFactorNew}>Add a New Factor</button>
                    <span className="ps-2"></span>
                    <button className="mt-4 w-50 btn btn rounded-1 btn-primary text-white">Next</button>
                </div>
            </div>
        </form>

    );
}

export default LandingForm2;

export { LandingBg, LandingForm1, LandingForm2 }