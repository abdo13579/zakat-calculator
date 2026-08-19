import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { calculateZuru } from '../domain/zuru.js';
import { formatNumber } from '../utils/format.js';
import { ResultCard } from '../components/ResultCard.jsx';

const ZURU_NISAAB = 600;

const IRRIGATION = [
    { value: 'rainfed', dataRate: 0.10, labelKey: 'zuru-rainfed' },
    { value: 'irrigated', dataRate: 0.05, labelKey: 'zuru-irrigated' },
    { value: 'mixed', dataRate: 0.075, labelKey: 'zuru-mixed' },
];

export function ZuruView() {
    const { t } = useI18n();
    const [weight, setWeight] = useState('');
    const [irrigation, setIrrigation] = useState('rainfed');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    function onSubmit(e) {
        e.preventDefault();
        const weightNum = /^\s*\d+(?:\.\d+)?\s*$/.test(weight) ? Number(weight.trim()) : NaN;
        const irrigationDef = IRRIGATION.find(i => i.value === irrigation);
        const rate = irrigationDef ? irrigationDef.dataRate : 0;
        if (isNaN(weightNum) || weightNum <= 0) {
            setError(t('error-invalid-input'));
            setResult(null);
            return;
        }
        const calc = calculateZuru({ weightKg: weightNum, irrigation });
        if (calc === null) {
            setError(t('error-invalid-input'));
            setResult(null);
            return;
        }
        setError(null);
        setResult({ ...calc, weightKg: weightNum, rate });
    }

    const ratePercent = result ? (result.rate * 100).toFixed(1) : null;

    return (
        <section id="zakat-al-zuru" className="page">
            <h2>{t('zuru-calculator-title')}</h2>
            <p className="section-helper-text">{t('zuru-helper-text')}</p>
            <form onSubmit={onSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="harvest-weight">{t('zuru-weight-label')}</label>
                    <div className="input-group">
                        <input
                            type="text"
                            inputMode="decimal"
                            id="harvest-weight"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder={t('zuru-weight-placeholder')}
                            aria-describedby="harvest-weight-addon"
                        />
                        <span id="harvest-weight-addon" className="input-addon">
                            kg
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="irrigation-type">{t('zuru-irrigation-label')}</label>
                    <select
                        id="irrigation-type"
                        value={irrigation}
                        onChange={(e) => setIrrigation(e.target.value)}
                    >
                        {IRRIGATION.map(i => (
                            <option key={i.value} value={i.value} data-rate={i.dataRate}>
                                {t(i.labelKey)}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="cta-button">{t('button-calculate')}</button>
            </form>

            {error && (
                <ResultCard title={null} plainText={error}>
                    <p className="error">{error}</p>
                </ResultCard>
            )}
            {result && (
                <ResultCard
                    title={t('zuru-result-title')}
                    plainText={
                        `${t('zuru-result-title')}\n${t('zuru-result-nisaab')}: ${ZURU_NISAAB} kg\n${t('zuru-result-rate')} ${ratePercent}%\n` +
                        (result.eligible
                            ? `${t('zuru-result-eligible')}\n${t('zuru-result-due')} ${formatNumber(result.zakatDue)} kg`
                            : `${t('zuru-result-not-eligible')}`)
                    }
                >
                    <p><strong>{t('zuru-result-nisaab')}:</strong> {ZURU_NISAAB} kg</p>
                    <p><strong>{t('zuru-result-rate')}</strong> {ratePercent}%</p>
                    <hr />
                    {result.eligible ? (
                        <>
                            <p>{t('zuru-result-eligible')}</p>
                            <p>
                                <strong>{t('zuru-result-due')}</strong>{' '}
                                <span className="accent-text">{formatNumber(result.zakatDue)} kg</span>
                            </p>
                        </>
                    ) : (
                        <p>{t('zuru-result-not-eligible')}</p>
                    )}
                </ResultCard>
            )}
        </section>
    );
}
