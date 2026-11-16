import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UIButton from "@/UI/Elements/Button";
import { useSubmitR3FactorVerificationMutation, useExpandR3FactorMutation } from "@/service/learningVerification";
import {
  CheckCircle2,
  CircleAlert,
  Network,
  Loader2,
  BookOpen,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type VerificationQuestion = {
  question: string;
  options: string[];
  questionNumber: number;
};

type Factor = {
  factorId: string;
  name: string;
  description?: string;
  learningContent?: string;
  verificationQuestions: VerificationQuestion[];
  children: Factor[];
  ownVerified: boolean;
  effectiveVerified: boolean;
  canExploreFurther: boolean;
  score?: number | null;
};

function collectFactors(factors: Factor[] = []): Factor[] {
  return factors.flatMap((factor) => [factor, ...collectFactors(factor.children || [])]);
}

export default function R3FactorDialog({
  open,
  onClose,
  paperId,
  questionId,
  questionNumber,
  data,
  isGenerating,
  error: generationError,
  onRetry,
}: {
  open: boolean;
  onClose: () => void;
  paperId: string;
  questionId: string;
  questionNumber: number;
  data: any;
  isGenerating: boolean;
  error: string;
  onRetry: () => void;
}) {
  const [submit, { isLoading: submitting }] = useSubmitR3FactorVerificationMutation();
  const [expand, { isLoading: expanding }] = useExpandR3FactorMutation();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [rootExpanded, setRootExpanded] = useState(true);
  const [selectedFactorId, setSelectedFactorId] = useState<string | null>(null);
  const [busyFactor, setBusyFactor] = useState("");
  const [error, setError] = useState("");

  const allFactors = useMemo(() => collectFactors(data?.factors || []), [data?.factors]);
  const selectedFactor = allFactors.find((factor) => factor.factorId === selectedFactorId) || null;

  // Start with the root level visible. Deeper levels remain collapsed until
  // the student explicitly uses that node's arrow, just like VS Code Explorer.
  useEffect(() => {
    if (open && data?.factors) {
      setExpandedIds(new Set());
      setRootExpanded(true);
      setSelectedFactorId(null);
      setAnswers({});
      setError("");
    }
  }, [open, data?.topic]);

  const toggleExpanded = (factorId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(factorId)) next.delete(factorId);
      else next.add(factorId);
      return next;
    });
  };

  const submitFactor = async (factor: Factor) => {
    const selected = answers[factor.factorId] || [];
    const questions = factor.verificationQuestions || [];
    if (selected.length !== questions.length || selected.some((answer) => !answer)) return;

    setBusyFactor(factor.factorId);
    setError("");
    try {
      await submit({
        paperId,
        questionId,
        questionNumber,
        factorId: factor.factorId,
        answers: selected,
      }).unwrap();
      onRetry();
    } catch (e: any) {
      setError(e?.data?.message || "Verification submission failed.");
    } finally {
      setBusyFactor("");
    }
  };

  const expandFactor = async (factor: Factor) => {
    setBusyFactor(factor.factorId);
    setError("");
    try {
      await expand({ paperId, questionId, questionNumber, factorId: factor.factorId }).unwrap();
      // Keep this factor's branch open after the new child factors are fetched.
      setExpandedIds((current) => new Set(current).add(factor.factorId));
      onRetry();
    } catch (e: any) {
      setError(e?.data?.message || "Unable to generate deeper factors.");
    } finally {
      setBusyFactor("");
    }
  };

  const renderFactor = (factor: Factor, isLast: boolean, depth = 0, prefixLast: boolean[] = []): any => {
    const hasChildren = Boolean(factor.children?.length);
    const isExpanded = expandedIds.has(factor.factorId);
    const isSelected = selectedFactorId === factor.factorId;

    return (
      <div key={factor.factorId} className="min-w-0">
        <div className={`flex items-center gap-1 min-h-9 rounded-md px-1 ${isSelected ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-slate-50"}`}>
          {/* Expansion is deliberately a separate control from factor selection. */}
          <span className="flex items-center shrink-0" style={{ width: "0px" }}>
            {prefixLast.map((ancestorIsLast, index) => (
              <span key={index} className="w-[18px] self-stretch flex justify-center text-slate-300 font-mono">
                {ancestorIsLast ? " " : "│"}
              </span>
            ))}
          </span>
          {hasChildren ? (
            <button
              type="button"
              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${factor.name}`}
              aria-expanded={isExpanded}
              onClick={() => toggleExpanded(factor.factorId)}
              className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-200 text-slate-600 shrink-0"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <span className="w-7 shrink-0 text-center text-slate-400 font-mono">·</span>
          )}
          <span className="font-mono text-slate-400 text-sm shrink-0">{isLast ? "└──" : "├──"}</span>
          <button
            type="button"
            onClick={() => {
              setSelectedFactorId(factor.factorId);
              setError("");
            }}
            aria-pressed={isSelected}
            className="min-w-0 flex-1 text-left py-1.5 px-1 rounded text-sm font-semibold text-slate-900 hover:text-blue-700"
          >
            {factor.name}
          </button>
          {factor.effectiveVerified ? (
            <span className="text-green-700 text-xs font-semibold inline-flex items-center gap-1 shrink-0 pr-1">
              <CheckCircle2 size={15} /> Verified
            </span>
          ) : (
            <span className="text-amber-700 text-xs font-semibold inline-flex items-center gap-1 shrink-0 pr-1">
              <CircleAlert size={15} /> Not verified
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2 border-l border-slate-200">
            {factor.children.map((child, index) =>
              renderFactor(child, index === factor.children.length - 1, depth + 1, [...prefixLast, isLast]),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="w-[96vw] max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Network size={20} /> R3 Factor – {data?.topic || "Analysing question"}
          </DialogTitle>
        </DialogHeader>

        {isGenerating && !data ? (
          <div className="py-12 text-center">
            <Loader2 className="animate-spin mx-auto" />
            <p className="mt-3 text-sm text-slate-500">
              AI is identifying the topic and preparing root-factor verification sets. This may take a moment.
            </p>
          </div>
        ) : null}

        {(generationError || error) && (
          <div className="rounded-lg bg-red-50 text-red-700 p-3 text-sm">
            {generationError || error}
            {!isGenerating && (
              <button type="button" className="ml-2 underline font-semibold" onClick={onRetry}>
                Retry
              </button>
            )}
          </div>
        )}

        {data && (
          <>
            <div className="rounded-xl bg-indigo-50 p-4">
              <div className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">AI identified topic</div>
              <div className="text-lg font-bold text-indigo-950">{data.topic}</div>
              <div className="text-sm text-indigo-800 mt-1">Secondary Factor: {data.secondaryFactor}</div>
            </div>

            <div className="rounded-xl border bg-white p-4 space-y-2">
              <div className="font-mono font-semibold text-slate-900 flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`${rootExpanded ? "Collapse" : "Expand"} R3 Structure`}
                  aria-expanded={rootExpanded}
                  onClick={() => setRootExpanded((value) => !value)}
                  className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-200 text-slate-600"
                >
                  {rootExpanded ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
                </button>
                R3 Structure
              </div>
              {rootExpanded && (
                <div className="pl-2 space-y-1">
                  {(data.factors || []).map((factor: Factor, index: number, list: Factor[]) =>
                    renderFactor(factor, index === list.length - 1),
                  )}
                </div>
              )}
              <p className="text-xs text-slate-500 pt-2 border-t">
                Use the arrow to expand or collapse a branch. Select a factor name to open only that factor's verification set.
              </p>
            </div>

            {selectedFactor && (
              <section className="rounded-xl border bg-white p-4 space-y-4" aria-live="polite">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Selected factor</div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedFactor.name}</h3>
                    {selectedFactor.description && (
                      <p className="text-sm text-slate-600 mt-1">{selectedFactor.description}</p>
                    )}
                  </div>
                  {selectedFactor.effectiveVerified ? (
                    <span className="text-green-700 text-sm font-semibold inline-flex items-center gap-1">
                      <CheckCircle2 size={16} /> Verified
                    </span>
                  ) : (
                    <span className="text-amber-700 text-sm font-semibold inline-flex items-center gap-1">
                      <CircleAlert size={16} /> Not verified
                    </span>
                  )}
                </div>

                <div className="rounded-lg bg-slate-50 p-3 space-y-3">
                  <div className="font-medium text-sm flex items-center gap-2">
                    <BookOpen size={16} /> Learning content
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedFactor.learningContent || selectedFactor.description || "Review this concept carefully."}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="font-medium text-sm flex items-center gap-2">
                    <ClipboardCheck size={16} /> Verification ({(selectedFactor.verificationQuestions || []).length} questions)
                  </div>
                  {(selectedFactor.verificationQuestions || []).map((question, index) => (
                    <div key={`${selectedFactor.factorId}-${index}`} className="border-t pt-3 space-y-2">
                      <p className="text-sm font-medium">{index + 1}. {question.question}</p>
                      {(question.options || []).map((option, optionIndex) => {
                        const value = String.fromCharCode(65 + optionIndex);
                        const selected = (answers[selectedFactor.factorId] || [])[index] === value;
                        return (
                          <label key={optionIndex} className="flex gap-2 items-start text-sm cursor-pointer">
                            <input
                              type="radio"
                              name={`${selectedFactor.factorId}-${index}`}
                              checked={selected}
                              onChange={() => setAnswers((previous) => {
                                const next = [...(previous[selectedFactor.factorId] || Array((selectedFactor.verificationQuestions || []).length).fill(""))];
                                next[index] = value;
                                return { ...previous, [selectedFactor.factorId]: next };
                              })}
                            />
                            <span>{value}. {option}</span>
                          </label>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <UIButton
                  variant="sky"
                  className="w-full"
                  disabled={
                    submitting ||
                    (answers[selectedFactor.factorId] || []).length !== (selectedFactor.verificationQuestions || []).length ||
                    (answers[selectedFactor.factorId] || []).some((answer) => !answer)
                  }
                  onClick={() => submitFactor(selectedFactor)}
                >
                  {submitting && busyFactor === selectedFactor.factorId ? "Submitting..." : "Submit verification"}
                </UIButton>

                {!selectedFactor.effectiveVerified && selectedFactor.canExploreFurther && (
                  <UIButton
                    variant="secondary"
                    className="w-full"
                    disabled={expanding || busyFactor === selectedFactor.factorId}
                    onClick={() => expandFactor(selectedFactor)}
                  >
                    {expanding && busyFactor === selectedFactor.factorId ? "Generating..." : "Explore Further"}
                  </UIButton>
                )}
              </section>
            )}
          </>
        )}

        <div className="flex justify-end">
          <UIButton variant="secondary" onClick={onClose}>Close</UIButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
