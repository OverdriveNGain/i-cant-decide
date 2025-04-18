import React from 'react';
import ChoicesForm from './ChoicesForm';
import FactorsForm from './FactorsForm';
import FactorImportanceForm from './FactorImportanceForm';
import RatingChoicesForm from './RatingChoicesForm';
import { Tern } from '../helpers/func';

/**
 * Component containing all the form steps for the decision-making process
 * 
 * @param {Object} props - Component props
 * @param {Array} props.stePdata - Current step data [currentStep, maxStep]
 * @param {Function} props.setChoices - Function to update choices
 * @param {Function} props.setFactors - Function to update factors
 * @param {Function} props.setRatingMatrix - Function to update rating matrix
 * @param {Function} props.onChangeForm - Function to handle form navigation
 * @param {Array} props.factors - Array of factors with ratings
 * @param {Array} props.choices - Array of choices
 * @param {Object} props.form1 - Ref for form 1
 * @param {Object} props.form2 - Ref for form 2
 * @param {Object} props.form3 - Ref for form 3
 * @param {Object} props.form4 - Ref for form 4
 */
const FormsSection = ({ 
  stePdata, 
  setChoices, 
  setFactors, 
  setRatingMatrix, 
  onChangeForm, 
  factors, 
  choices,
  form1,
  form2,
  form3,
  form4
}) => {
  return (
    <div>
      <div ref={form1} className="animated-all" style={{
        opacity: Tern(stePdata[0] === 1, 1.0, 0.4),
      }}>
        <ChoicesForm 
          upperSetChoices={setChoices} 
          onChangeForm={onChangeForm} 
          currentStep={stePdata[0]} 
        />
      </div>
      
      <div ref={form2} style={{
        opacity: Tern(stePdata[0] === 2, 1.0, 0.4),
        display: Tern(stePdata[1] >= 2, "block", "none")
      }}>
        <FactorsForm 
          upperSetFactors={setFactors} 
          existingFactors={factors} 
          onChangeForm={onChangeForm} 
          currentStep={stePdata[0]} 
        />
      </div>
      
      <div ref={form3} style={{
        opacity: Tern(stePdata[0] === 3, 1.0, 0.4),
        display: Tern(stePdata[1] >= 3, "block", "none")
      }}>
        <FactorImportanceForm 
          upperSetFactors={setFactors} 
          initialFactors={factors} 
          onChangeForm={onChangeForm} 
          currentStep={stePdata[0]} 
        />
      </div>
      
      <div ref={form4} style={{
        opacity: Tern(stePdata[0] === 4, 1.0, 0.4),
        display: Tern(stePdata[1] >= 4, "block", "none")
      }}>
        <RatingChoicesForm 
          factors={factors} 
          choices={choices} 
          onChangeForm={onChangeForm} 
          currentStep={stePdata[0]} 
          upperSetRatingMatrix={setRatingMatrix} 
        />
      </div>
    </div>
  );
};

export default FormsSection;
