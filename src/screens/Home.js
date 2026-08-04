import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Pd, Tern } from "../helpers/func";
import useResize from "../hooks/useResize";
import Results from "../components/Results";
import ConfirmationModal from "../components/ConfirmationModal";
import Header from "../components/Header";
import FormsSection from "../components/FormsSection";
import { clearAllStoredData, determineStartingStep, getFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } from "../helpers/storage";
import { AppStateContext } from "../contexts/AppStateContext";

const Home = () => {
    const form1 = useRef(null)
    const form2 = useRef(null)
    const form3 = useRef(null)
    const form4 = useRef(null)
    const form5 = useRef(null)

    // Initialize state from localStorage or use default values
    const [choices, setChoices] = useState(() => getFromLocalStorage(STORAGE_KEYS.CHOICES, []))
    const [factors, setFactors] = useState(() => getFromLocalStorage(STORAGE_KEYS.FACTORS, []))
    const [ratingMatrix, setRatingMatrix] = useState(() => getFromLocalStorage(STORAGE_KEYS.RATING_MATRIX, {}))
    const [stepData, setStepData] = useState(() => determineStartingStep()); // step, and maxStep

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
        saveToLocalStorage(STORAGE_KEYS.STEP_DATA, stepData);
    }, [stepData]);

    const onChangeForm = (e, nextStage) => { 
        Pd(e, () => { 
            setStepData((prev) => [nextStage, Math.max(nextStage, prev[1])]); 
        }); 
    }

    // State for confirmation modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
    // Open confirmation modal
    const openConfirmModal = (e) => {
        if (e) e.preventDefault();
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
        setRatingMatrix({});
        setStepData([1, 1]);
        
        setShowConfirmModal(false);
    }

    useLayoutEffect(() => {
        const options = true;
        switch (stepData[0]) {
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
    }, [stepData])

    return (
        <AppStateContext.Provider value={{
            choices,
            setChoices,
            factors,
            setFactors,
            ratingMatrix,
            setRatingMatrix,
            stepData,
            onChangeForm
        }}>
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
                
                <p className="text-center fw-bold mb-2">Struggling with complex purchasing decisions? Evaluating multiple options with competing priorities? This tool provides a structured approach to making well-informed decisions.</p>
                <p className="text-center mb-5 text-sm">This tool uses normalized weighted sums to calculate the best option, based on your the relative importance of each factor of which each choice is evaluated.</p>
                <div style={{ width: `${breakpointSelector(100, 90, 80, 70, 60)}%`, margin: "auto" }}>
                    <FormsSection
                        form1={form1}
                        form2={form2}
                        form3={form3}
                        form4={form4}
                    />
                </div>
            </div>
            <div ref={form5} style={{
                opacity: Tern(stepData[0] === 5, 1.0, 0.4),
                display: Tern(stepData[1] >= 5, "block", "none")
            }}>
                <Results />
            </div>
        </div>
        </AppStateContext.Provider>
    );
}

export default Home;