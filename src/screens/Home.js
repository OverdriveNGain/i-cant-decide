import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Pd, Tern } from "../helpers/func";
import useResize from "../hooks/useResize";
// import Math from 'math';
import { LandingForm1, LandingForm2, LandingForm3, LandingForm4, Results } from "./HomeComponents";
import { STORAGE_KEYS, saveToLocalStorage, getFromLocalStorage, determineStartingStep, clearAllStoredData } from "../helpers/storage";
import ConfirmationModal from "../components/ConfirmationModal.js";

const Home = () => {
    const form1 = useRef(null)
    const form2 = useRef(null)
    const form3 = useRef(null)
    const form4 = useRef(null)
    const form5 = useRef(null)

    // Initialize state from localStorage or use default values
    const [choices, setChoices] = useState(() => getFromLocalStorage(STORAGE_KEYS.CHOICES, []))
    const [factors, setFactors] = useState(() => getFromLocalStorage(STORAGE_KEYS.FACTORS, []))
    const [ratingMatrix, setRatingMatrix] = useState(() => getFromLocalStorage(STORAGE_KEYS.RATING_MATRIX, []))

    // Determine the appropriate starting step based on saved data
    const [stePdata, setStepData] = useState(() => determineStartingStep()); // step, and maxStep

    const { breakpointSelector } = useResize();


    // Save data to localStorage whenever it changes
    useEffect(() => {
        if (choices.length > 0) {
            saveToLocalStorage(STORAGE_KEYS.CHOICES, choices);
        }
    }, [choices]);

    useEffect(() => {
        if (factors.length > 0) {
            saveToLocalStorage(STORAGE_KEYS.FACTORS, factors);
        }
    }, [factors]);

    useEffect(() => {
        if (Object.keys(ratingMatrix).length > 0) {
            saveToLocalStorage(STORAGE_KEYS.RATING_MATRIX, ratingMatrix);
        }
    }, [ratingMatrix]);

    useEffect(() => {
        saveToLocalStorage(STORAGE_KEYS.STEP_DATA, stePdata);
    }, [stePdata]);

    const onChangeForm = (e, nextStage) => { 
        Pd(e, () => { 
            setStepData([nextStage, Math.max(nextStage, stePdata[1])]); 
        }); 
    }

    // State for confirmation modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
    // Open confirmation modal
    const openConfirmModal = (e) => {
        if (e) e.preventDefault();
        console.log('Opening modal');
        setShowConfirmModal(true);
    };
    
    // Close confirmation modal
    const closeConfirmModal = () => {
        setShowConfirmModal(false);
    };
    
    // Reset app after confirmation
    const resetApp = () => {
        // Clear all stored data
        clearAllStoredData();
        
        // Reset state
        setChoices([]);
        setFactors([]);
        setRatingMatrix([]);
        setStepData([1, 1]);
        
        // Close the modal
        setShowConfirmModal(false);
    }

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
                {/* Responsive top spacing - larger on desktop, smaller on mobile */}
                <div className="d-none d-md-block" style={{ height: "10vh" }}></div>
                <div className="d-block d-md-none" style={{ height: "5vh" }}></div>
                <div className="position-relative mb-2">
                    {/* Responsive title and button layout */}
                    <div className="d-none d-md-block"> {/* Desktop layout (centered title) */}
                        <div className="position-relative">
                            <div className="display-1 h1 fw-bold text-center text-primary font-title m-0">I can't decide</div>
                            
                            <button 
                                className="btn btn-sm btn-outline-danger position-absolute" 
                                style={{ top: '50%', right: 0, transform: 'translateY(-50%)' }}
                                onClick={(e) => openConfirmModal(e)}
                                title="Clear all data and start over"
                            >
                                Clear Data
                            </button>
                        </div>
                    </div>
                    
                    <div className="d-flex d-md-none justify-content-between align-items-center"> {/* Mobile layout (corners) */}
                        <div className="h2 fw-bold text-primary font-title m-0">I can't decide</div>
                        
                        <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={(e) => openConfirmModal(e)}
                            title="Clear all data and start over"
                        >
                            Clear Data
                        </button>
                    </div>
                </div>
                
                {/* Confirmation Modal Component */}
                <ConfirmationModal 
                    show={showConfirmModal}
                    onClose={closeConfirmModal}
                    onConfirm={resetApp}
                />
                {/* Desktop tagline spacing */}
                <p className="d-none d-md-block text-center text-muted o-50 mb-5">A Rational Helper for the Indecisive</p>
                
                {/* Mobile tagline spacing - equal margins above and below */}
                <p className="d-block d-md-none text-center text-muted o-50 mt-4 mb-4">A Rational Helper for the Indecisive</p>
                
                <p className="text-center">Can't pick the right bag to buy? Don't know which laptop is worth buying the most? Don't know which college to go for? <strong>You've come to the right place.</strong></p>
                <p className="text-center">For example; let's say you have to pick between 3 laptops, and each laptop has different ratings in their CPU, batteries, RAM, etc. You thought that in general, these laptops are okay overall, but you want the best. Not only that, but you value RAM over battery quality, but not as much as CPU performance. </p>
                <p className="text-center fw-bold mb-5">So yeah, this tool aims to solve problems like that.</p>
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
                            <LandingForm2 upperSetFactors={setFactors} existingFactors={factors} onChangeForm={onChangeForm} currentStep={stePdata[0]} />
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
        </div>
    );
}

export default Home;