import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Pd, Tern } from "../helpers/func";
import useResize from "../hooks/useResize";
import Results from "../components/Results";
import ConfirmationModal from "../components/ConfirmationModal";
import Header from "../components/Header";
import FormsSection from "../components/FormsSection";
import { clearAllStoredData, determineStartingStep, getFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } from "../helpers/storage";

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
        clearAllStoredData();

        setChoices([]);
        setFactors([]);
        setRatingMatrix([]);
        setStepData([1, 1]);
        
        setShowConfirmModal(false);
    }

    useLayoutEffect(() => {
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
                <div style={{ height: "2vh" }} />
                <Header onClearData={(e) => openConfirmModal(e)} />
                
                {/* Confirmation Modal Component */}
                <ConfirmationModal 
                    show={showConfirmModal}
                    onClose={closeConfirmModal}
                    onConfirm={resetApp}
                />
                
                <p className="text-center text-muted o-50 mb-md-5 mt-md-0 mt-4 mb-4">A Rational Helper for the Indecisive</p>
                
                <p className="text-center">Can't pick the right bag to buy? Don't know which laptop is worth buying the most? Don't know which college to go for? <strong>You've come to the right place.</strong></p>
                <p className="text-center">For example; let's say you have to pick between 3 laptops, and each laptop has different ratings in their CPU, batteries, RAM, etc. You thought that in general, these laptops are okay overall, but you want the best. Not only that, but you value RAM over battery quality, but not as much as CPU performance. </p>
                <p className="text-center fw-bold mb-5">So yeah, this tool aims to solve problems like that.</p>
                <div style={{ width: `${breakpointSelector(100, 90, 80, 70, 60)}%`, margin: "auto" }}>
                    <FormsSection
                        stePdata={stePdata}
                        setChoices={setChoices}
                        setFactors={setFactors}
                        setRatingMatrix={setRatingMatrix}
                        onChangeForm={onChangeForm}
                        factors={factors}
                        choices={choices}
                        form1={form1}
                        form2={form2}
                        form3={form3}
                        form4={form4}
                    />
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