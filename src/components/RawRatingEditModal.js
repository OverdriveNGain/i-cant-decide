import React, { useEffect } from 'react';
import { renderFivePointInterpretation } from '../helpers/fivePointRatingDisplay';
import { preventEnterKeySubmission } from '../helpers/utils';
import useResize from '../hooks/useResize';

/**
 * Dialog to change a choice's raw 1–5 rating (step 4) with explicit confirm/cancel.
 */
const RawRatingEditModal = ({
    choiceName,
    factorName,
    draftRating,
    previewNormalized,
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

    const ratingToWords = (rating) =>
        renderFivePointInterpretation(rating, breakpointSelector(true, null, false));

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
                aria-labelledby="rawRatingModalTitle"
                style={{ zIndex: 1055, width: '100%', maxWidth: dialogMaxWidth }}
            >
                <div
                    className="card rounded-2 shadow border-0 overflow-hidden"
                    style={{ animation: 'fadeInDown 0.25s ease-out' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-secondary py-2 px-3 text-start rounded-top">
                        <span className="text-white" id="rawRatingModalTitle">
                            Change choice rating
                        </span>
                    </div>
                    <div className="px-2 px-sm-3 py-3">
                        <p className="small text-muted mb-2 px-1">
                            Factor: <span className="text-body fw-semibold">{factorName}</span>
                        </p>
                        <div className="d-flex flex-row align-items-center text-muted mb-3">
                            <div className="container p-0">
                                <div className="row m-0 align-items-center">
                                    <span className="col-6 px-2">
                                        <div
                                            className="fw-bold text-center rounded-1 px-2"
                                            style={{ backgroundColor: 'rgb(240, 240, 240)' }}
                                        >
                                            {choiceName}
                                        </div>
                                    </span>
                                    <input
                                        id="rawRatingRange"
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
                                    <div>{ratingToWords(draftRating)}</div>,
                                    null,
                                    <div
                                        className="text-center rounded-1 px-2"
                                        style={{ backgroundColor: 'rgb(240, 240, 240)' }}
                                    >
                                        {ratingToWords(draftRating)}
                                    </div>,
                                )}
                            </span>
                        </div>
                        <div
                            className="rounded-1 px-2 py-2 small text-center text-muted"
                            style={{ backgroundColor: 'rgb(248, 249, 250)', border: '1px solid rgba(0,0,0,0.06)' }}
                        >
                            <span className="text-body fw-semibold">{draftRating}</span>
                            {' will become '}
                            <span className="text-body fw-semibold">{previewNormalized.toFixed(2)}</span>
                            {' after normalization'}
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

export default RawRatingEditModal;
