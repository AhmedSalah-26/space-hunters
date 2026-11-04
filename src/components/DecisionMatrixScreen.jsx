'use client';
import RotationStrategyWorkbench from './rotation/RotationStrategyWorkbench';
export default function DecisionMatrixScreen({ mission, onBack, onDecisionSubmit }) {
  return <RotationStrategyWorkbench mission={mission} onBack={onBack} onDecisionSubmit={onDecisionSubmit} />;
}
