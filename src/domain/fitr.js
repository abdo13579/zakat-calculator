// calculateFitr: pure, contract-driven.
// Contract: specs/002-react-migration/contracts/calculation-api.md

export function calculateFitr({ persons, pricePerKg }) {
    if (
        typeof persons !== 'number' || !Number.isFinite(persons) ||
        typeof pricePerKg !== 'number' || !Number.isFinite(pricePerKg) ||
        persons < 1 || pricePerKg < 0
    ) return null;

    const totalWeightKg = persons * 3.0;
    const totalValue = totalWeightKg * pricePerKg;
    return { totalWeightKg, totalValue };
}
