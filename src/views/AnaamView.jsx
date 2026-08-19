import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import {
    LIVESTOCK_SPECIES,
    NISAB_THRESHOLDS,
    calculateAnaam,
} from '../domain/anaam.js';
import { ResultCard } from '../components/ResultCard.jsx';
import styles from './AnaamView.module.css';

export function AnaamView() {
    const { t } = useI18n();

    const [species, setSpecies] = useState(LIVESTOCK_SPECIES.SHEEP_GOATS);
    const [count, setCount] = useState('');
    const [isGrazing, setIsGrazing] = useState(true);
    const [isNonWorking, setIsNonWorking] = useState(true);
    const [heldForHawl, setHeldForHawl] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showRefSchedules, setShowRefSchedules] = useState(false);

    function onSubmit(e) {
        e.preventDefault();
        const trimmed = count.trim();
        const isValid = /^\d+$/.test(trimmed) && Number.isInteger(+count) && +count >= 0;

        if (!isValid) {
            setError(t('error-invalid-input'));
            setResult(null);
            return;
        }

        const parsedCount = parseInt(trimmed, 10);

        const conditions = { isGrazing, isNonWorking, heldForHawl };
        const calc = calculateAnaam({ species, count: parsedCount, conditions });

        if (calc === null) {
            setError(t('error-invalid-input'));
            setResult(null);
            return;
        }

        setError(null);
        setResult(calc);
    }

    function buildPlainText(calc) {
        if (!calc) return '';
        const lines = [t('anaam-result-title')];
        lines.push(`${t('anaam-result-nisab')} ${calc.nisab}`);

        if (!calc.isEligible) {
            if (calc.ineligibilityReason && calc.ineligibilityReason !== 'below-nisab') {
                lines.push(t(calc.ineligibilityReason));
            } else {
                lines.push(t('anaam-result-not-eligible'));
            }
            return lines.join('\n');
        }

        lines.push(t('anaam-result-eligible'));
        lines.push(t('anaam-result-due'));

        calc.zakatDueItems.forEach((item) => {
            const animalName = t(item.key);
            const ageDesc = item.ageDescriptionKey ? ` (${t(item.ageDescriptionKey)})` : '';
            lines.push(`- ${item.count} × ${animalName}${ageDesc}`);
        });

        if (calc.alternateCombinations && calc.alternateCombinations.length > 0) {
            lines.push(t('anaam-result-alternate'));
            calc.alternateCombinations.forEach((alt) => {
                const altText = alt
                    .map((item) => `${item.count} × ${t(item.key)}`)
                    .join(' + ');
                lines.push(`- ${altText}`);
            });
        }

        return lines.join('\n');
    }

    // Determine if any eligibility warning message should be shown
    let eligibilityWarning = null;
    if (!isGrazing) {
        eligibilityWarning = t('anaam-ineligible-stall-fed');
    } else if (!isNonWorking) {
        eligibilityWarning = t('anaam-ineligible-working');
    } else if (!heldForHawl) {
        eligibilityWarning = t('anaam-ineligible-no-hawl');
    }

    return (
        <section id="zakat-al-anaam" className="page">
            <h2>{t('anaam-calculator-title')}</h2>
            <p className="section-helper-text">{t('anaam-helper-text')}</p>

            <form onSubmit={onSubmit} noValidate>
                {/* 1. Species Selection */}
                <div className="form-group">
                    <label htmlFor="livestock-species">{t('anaam-species-label')}</label>
                    <select
                        id="livestock-species"
                        value={species}
                        onChange={(e) => {
                            setSpecies(e.target.value);
                            setResult(null);
                            setError(null);
                        }}
                    >
                        <option value={LIVESTOCK_SPECIES.SHEEP_GOATS}>
                            {t('anaam-species-sheep-goats')}
                        </option>
                        <option value={LIVESTOCK_SPECIES.CATTLE}>
                            {t('anaam-species-cattle')}
                        </option>
                        <option value={LIVESTOCK_SPECIES.CAMELS}>
                            {t('anaam-species-camels')}
                        </option>
                    </select>
                </div>

                {/* 2. Shariah Eligibility Checklist */}
                <div className={styles.eligibilityBox}>
                    <h3 className={styles.eligibilityTitle}>
                        <i className="fas fa-clipboard-check"></i>
                        <span>{t('anaam-eligibility-title')}</span>
                    </h3>
                    <div className={styles.checkboxList}>
                        <label className={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                id="cond-grazing"
                                className={styles.checkboxInput}
                                checked={isGrazing}
                                onChange={(e) => {
                                    setIsGrazing(e.target.checked);
                                    setResult(null);
                                    setError(null);
                                }}
                            />
                            <span className={styles.checkboxLabel}>{t('anaam-cond-grazing')}</span>
                        </label>
                        <label className={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                id="cond-nonworking"
                                className={styles.checkboxInput}
                                checked={isNonWorking}
                                onChange={(e) => {
                                    setIsNonWorking(e.target.checked);
                                    setResult(null);
                                    setError(null);
                                }}
                            />
                            <span className={styles.checkboxLabel}>{t('anaam-cond-nonworking')}</span>
                        </label>
                        <label className={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                id="cond-hawl"
                                className={styles.checkboxInput}
                                checked={heldForHawl}
                                onChange={(e) => {
                                    setHeldForHawl(e.target.checked);
                                    setResult(null);
                                    setError(null);
                                }}
                            />
                            <span className={styles.checkboxLabel}>{t('anaam-cond-hawl')}</span>
                        </label>
                    </div>

                    {eligibilityWarning && (
                        <div className={styles.alertBox} role="alert">
                            <i className="fas fa-info-circle"></i> {eligibilityWarning}
                        </div>
                    )}
                </div>

                {/* 3. Herd Count Input */}
                <div className="form-group">
                    <label htmlFor="livestock-count">{t('anaam-count-label')}</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        id="livestock-count"
                        value={count}
                        onChange={(e) => {
                            setCount(e.target.value);
                            setResult(null);
                            setError(null);
                        }}
                        placeholder={t('anaam-count-placeholder')}
                        required
                    />
                </div>

                <button type="submit" className="cta-button">
                    {t('button-calculate')}
                </button>
            </form>

            {/* Error Message */}
            {error && (
                <ResultCard title={null} plainText={error}>
                    <p className="error">{error}</p>
                </ResultCard>
            )}

            {/* Result Presentation */}
            {result && (
                <ResultCard
                    title={t('anaam-result-title')}
                    plainText={buildPlainText(result)}
                >
                    <p>
                        <strong>{t('anaam-result-nisab')}</strong>{' '}
                        <span>{result.nisab}</span>
                    </p>

                    <hr />

                    {!result.isEligible ? (
                        <div>
                            <p className={result.ineligibilityReason && result.ineligibilityReason !== 'below-nisab' ? 'error' : ''}>
                                {result.ineligibilityReason && result.ineligibilityReason !== 'below-nisab'
                                    ? t(result.ineligibilityReason)
                                    : t('anaam-result-not-eligible')}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p>{t('anaam-result-eligible')}</p>
                            <p><strong>{t('anaam-result-due')}</strong></p>

                            <ul className={styles.resultList}>
                                {result.zakatDueItems.map((item, idx) => (
                                    <li key={idx} className={styles.resultItem}>
                                        <div className={styles.itemHeader}>
                                            <span className={styles.itemCount}>{item.count} ×</span>
                                            <span>{t(item.key)}</span>
                                        </div>
                                        {item.ageDescriptionKey && (
                                            <span className={styles.itemAge}>
                                                {t(item.ageDescriptionKey)}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {result.alternateCombinations && result.alternateCombinations.length > 0 && (
                                <div className={styles.alternateBox}>
                                    <div className={styles.alternateTitle}>
                                        {t('anaam-result-alternate')}
                                    </div>
                                    {result.alternateCombinations.map((alt, idx) => (
                                        <div key={idx}>
                                            {alt.map((item, i) => (
                                                <span key={i}>
                                                    {item.count} × {t(item.key)}
                                                    {i < alt.length - 1 ? ' + ' : ''}
                                                </span>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <p className={styles.disclaimerText}>{t('anaam-disclaimer')}</p>
                </ResultCard>
            )}

            {/* Reference Schedules */}
            <div className={styles.refSection}>
                <button
                    type="button"
                    className={styles.refToggleBtn}
                    onClick={() => setShowRefSchedules((prev) => !prev)}
                    aria-expanded={showRefSchedules}
                >
                    <i className={`fas fa-${showRefSchedules ? 'chevron-up' : 'chevron-down'}`}></i>
                    <span>
                        {showRefSchedules
                            ? t('anaam-ref-toggle-hide')
                            : t('anaam-ref-toggle-show')}
                    </span>
                </button>

                {showRefSchedules && (
                    <div className={styles.refContent}>
                        {/* Sheep & Goats Schedule */}
                        <div className={styles.tableContainer}>
                            <h3 className={styles.tableTitle}>{t('anaam-species-sheep-goats')}</h3>
                            <table className={styles.refTable}>
                                <thead>
                                    <tr>
                                        <th>{t('anaam-ref-range')}</th>
                                        <th>{t('anaam-ref-due')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1 – 39</td>
                                        <td>0 ({t('anaam-ref-below-nisab')})</td>
                                    </tr>
                                    <tr>
                                        <td>40 – 120</td>
                                        <td>1 × {t('anaam-animal-shah')}</td>
                                    </tr>
                                    <tr>
                                        <td>121 – 200</td>
                                        <td>2 × {t('anaam-animal-shah')}</td>
                                    </tr>
                                    <tr>
                                        <td>201 – 399</td>
                                        <td>3 × {t('anaam-animal-shah')}</td>
                                    </tr>
                                    <tr>
                                        <td>400+</td>
                                        <td>1 × {t('anaam-animal-shah')} {t('anaam-ref-per-100')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Cattle Schedule */}
                        <div className={styles.tableContainer}>
                            <h3 className={styles.tableTitle}>{t('anaam-species-cattle')}</h3>
                            <table className={styles.refTable}>
                                <thead>
                                    <tr>
                                        <th>{t('anaam-ref-range')}</th>
                                        <th>{t('anaam-ref-due')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1 – 29</td>
                                        <td>0 ({t('anaam-ref-below-nisab')})</td>
                                    </tr>
                                    <tr>
                                        <td>30 – 39</td>
                                        <td>1 × {t('anaam-animal-tabi')}</td>
                                    </tr>
                                    <tr>
                                        <td>40 – 59</td>
                                        <td>1 × {t('anaam-animal-musinnah')}</td>
                                    </tr>
                                    <tr>
                                        <td>60 – 69</td>
                                        <td>2 × {t('anaam-animal-tabi')}</td>
                                    </tr>
                                    <tr>
                                        <td>70 – 79</td>
                                        <td>1 × {t('anaam-animal-musinnah')} + 1 × {t('anaam-animal-tabi')}</td>
                                    </tr>
                                    <tr>
                                        <td>80 – 89</td>
                                        <td>2 × {t('anaam-animal-musinnah')}</td>
                                    </tr>
                                    <tr>
                                        <td>90 – 99</td>
                                        <td>3 × {t('anaam-animal-tabi')}</td>
                                    </tr>
                                    <tr>
                                        <td>100 – 109</td>
                                        <td>1 × {t('anaam-animal-musinnah')} + 2 × {t('anaam-animal-tabi')}</td>
                                    </tr>
                                    <tr>
                                        <td>110 – 119</td>
                                        <td>2 × {t('anaam-animal-musinnah')} + 1 × {t('anaam-animal-tabi')}</td>
                                    </tr>
                                    <tr>
                                        <td>120 – 129</td>
                                        <td>3 × {t('anaam-animal-musinnah')} (or 4 × {t('anaam-animal-tabi')})</td>
                                    </tr>
                                    <tr>
                                        <td>130+</td>
                                        <td>1 × {t('anaam-animal-musinnah')} {t('anaam-ref-cattle-continuation', { tabi: t('anaam-animal-tabi') })}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Camels Schedule */}
                        <div className={styles.tableContainer}>
                            <h3 className={styles.tableTitle}>{t('anaam-species-camels')}</h3>
                            <table className={styles.refTable}>
                                <thead>
                                    <tr>
                                        <th>{t('anaam-ref-range')}</th>
                                        <th>{t('anaam-ref-due')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1 – 4</td>
                                        <td>0 ({t('anaam-ref-below-nisab')})</td>
                                    </tr>
                                    <tr>
                                        <td>5 – 9</td>
                                        <td>1 × {t('anaam-animal-shah')}</td>
                                    </tr>
                                    <tr>
                                        <td>10 – 14</td>
                                        <td>2 × {t('anaam-animal-shah')}</td>
                                    </tr>
                                    <tr>
                                        <td>15 – 19</td>
                                        <td>3 × {t('anaam-animal-shah')}</td>
                                    </tr>
                                    <tr>
                                        <td>20 – 24</td>
                                        <td>4 × {t('anaam-animal-shah')}</td>
                                    </tr>
                                    <tr>
                                        <td>25 – 35</td>
                                        <td>1 × {t('anaam-animal-bint-makhad')}</td>
                                    </tr>
                                    <tr>
                                        <td>36 – 45</td>
                                        <td>1 × {t('anaam-animal-bint-labun')}</td>
                                    </tr>
                                    <tr>
                                        <td>46 – 60</td>
                                        <td>1 × {t('anaam-animal-hiqqah')}</td>
                                    </tr>
                                    <tr>
                                        <td>61 – 75</td>
                                        <td>1 × {t('anaam-animal-jadhaah')}</td>
                                    </tr>
                                    <tr>
                                        <td>76 – 90</td>
                                        <td>2 × {t('anaam-animal-bint-labun')}</td>
                                    </tr>
                                    <tr>
                                        <td>91 – 120</td>
                                        <td>2 × {t('anaam-animal-hiqqah')}</td>
                                    </tr>
                                    <tr>
                                        <td>121+</td>
                                        <td>1 × {t('anaam-animal-hiqqah')} {t('anaam-ref-camels-continuation', { bintLabun: t('anaam-animal-bint-labun') })}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
