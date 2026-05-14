import React, { useEffect } from 'react';
import { renderFactorImportanceInterpretation } from '../helpers/factorImportanceInterpretation';
import { preventEnterKeySubmission } from '../helpers/utils';
import useResize from '../hooks/useResize';

/**
 * Dialog to change a factor's importance (1–5) with explicit confirm/cancel.
 */
const FactorImportanceEditModal = ({
    factorName,
    draftRating,
    onDraftChange,
    onConfirm,
    onCancel,
}) => {
    const { breakpointSelector } = useResize();
    const dialogMaxWidth = breakpointSelector(
        'min(94vw, 100%)',
        'min(92vw, 26.25rem)',
        'min(90vw, 28.5rem)',
        'min(88vw, 31.5rem)',
        'min(86vw, 33.75rem)',
        'min(84vw, 36rem)',
    );

    const interpretation = (rating) => renderFactorImportanceInterpretation(rating);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onCancel]);

    return (
        <>
            <div
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    zIndex: 1050,
                    backdropFilter: 'blur(2px)',
                }}
                aria-hidden="true"
                onClick={onCancel}
            />
            <div
                className="position-fixed top-50 start-50 translate-middle"
                role="dialog"
                aria-modal="true"
                aria-labelledby="factorImportanceModalTitle"
                style={{ zIndex: 1055, width: '100%', maxWidth: dialogMaxWidth }}
            >
                <div
                    className="card rounded-2 shadow border-0 overflow-hidden"
                    style={{ animation: 'fadeInDown 0.25s ease-out' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-secondary py-2 px-3 text-start rounded-top">
                        <span className="text-white" id="factorImportanceModalTitle">
                            Change factor importance
                        </span>
                    </div>
                    <div className="px-2 px-sm-3 py-3">
                        <div className="d-flex flex-row align-items-center text-muted mb-0">
                            <div className="container p-0">
                                <div className="row m-0 align-items-center">
                                    <span className="col-6 px-2">
                                        <div className="fw-bold text-center rounded-1 px-2" style={{ backgroundColor: 'rgb(240, 240, 240)' }}>
                                            {factorName}...
                                        </div>
                                    </span>
                                    <input
                                        id="factorImportanceRange"
                                        className="col-6 px-2"
                                        type="range"
                                        min={1}
                                        max={5}
                                        step={1}
                                        value={draftRating}
                                        onChange={(e) => onDraftChange(parseInt(e.target.value, 10))}
                                        onKeyDown={preventEnterKeySubmission}
                                    />
                                </div>
                            </div>
                            <span className={breakpointSelector('px-2', null, 'w-50 text-center px-2')}>
                                {breakpointSelector(
                                    <div>{interpretation(draftRating)}</div>,
                                    null,
                                    <div className="text-center rounded-1 px-2" style={{ backgroundColor: 'rgb(240, 240, 240)' }}>
                                        {interpretation(draftRating)}
                                    </div>,
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 p-3 border-top bg-light">
                        <button type="button" className="btn rounded-1 btn-outline-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="button" className="btn rounded-1 btn-primary text-white" onClick={onConfirm}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
            <style>
                {`
                    @keyframes fadeInDown {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </>
    );
};

export default FactorImportanceEditModal;
