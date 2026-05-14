import React from 'react';
import ChoicesForm from './ChoicesForm';
import FactorsForm from './FactorsForm';
import FactorImportanceForm from './FactorImportanceForm';
import RatingChoicesForm from './RatingChoicesForm';
import { Tern } from '../helpers/func';
import { useContext } from 'react';
import { AppStateContext } from '../contexts/AppStateContext';

/**
 * Component containing all the form steps for the decision-making process
 * 
 * @param {Object} props - Component props
 * @param {Object} props.form1 - Ref for form 1
 * @param {Object} props.form2 - Ref for form 2
 * @param {Object} props.form3 - Ref for form 3
 * @param {Object} props.form4 - Ref for form 4
 */
const FormsSection = ({ 
  form1,
  form2,
  form3,
  form4
}) => {
  const {
    stepData,
    setFactors,
    onChangeForm,
    factors,
  } = useContext(AppStateContext);
  return (
    <div>
      <div ref={form1} className="animated-all" style={{
        opacity: Tern(stepData[0] === 1, 1.0, 0.4),
      }}>
        <ChoicesForm 
          onChangeForm={onChangeForm} 
          currentStep={stepData[0]} 
        />
      </div>
      
      <div ref={form2} style={{
        opacity: Tern(stepData[0] === 2, 1.0, 0.4),
        display: Tern(stepData[1] >= 2, "block", "none")
      }}>
        <FactorsForm 
          onChangeForm={onChangeForm} 
        />
      </div>
      
      <div ref={form3} style={{
        opacity: Tern(stepData[0] === 3, 1.0, 0.4),
        display: Tern(stepData[1] >= 3, "block", "none")
      }}>
        <FactorImportanceForm 
          upperSetFactors={setFactors} 
          initialFactors={factors} 
          onChangeForm={onChangeForm} 
          currentStep={stepData[0]} 
        />
      </div>
      
      <div ref={form4} style={{
        opacity: Tern(stepData[0] === 4, 1.0, 0.4),
        display: Tern(stepData[1] >= 4, "block", "none")
      }}>
        <RatingChoicesForm 
          onChangeForm={onChangeForm} 
        />
      </div>
    </div>
  );
};

export default FormsSection;
