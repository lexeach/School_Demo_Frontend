import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UIButton from "@/UI/Elements/Button";
import { useSubmitR3FactorVerificationMutation, useExpandR3FactorMutation } from "@/service/learningVerification";
import {
  CheckCircle2,
  CircleAlert,
  Circle,
  Network,
  Loader2,
  BookOpen,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Target,
  RefreshCw,
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
  attempts?: number;
  score?: number | null;
  totalQuestions?: number;
};

type LocalResult = { score: number; totalQuestions: number; status: string };

type FactorStatus = "Verified" | "Needs practice" | "Pending";

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
  const [localResults, setLocalResults] = useState<Record<string, LocalResult>>({});
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [rootExpanded, setRootExpanded] = useState(true);
  const [selectedFactorId, setSelectedFactorId] = useState<string | null>(null);
  const [busyFactor, setBusyFactor] = useState("");
  const [error, setError] = useState("");
  const [showLearning, setShowLearning] = useState(true);

  const allFactors = useMemo(() => collectFactors(data?.factors || []), [data?.factors]);
  const selectedFactor = allFactors.find((factor) => factor.factorId === selectedFactorId) || null;

  useEffect(() => {
    if (open && data?.factors) {
      setExpandedIds(new Set());
      setRootExpanded(true);
      setSelectedFactorId(null);
      setAnswers({});
      setLocalResults({});
      setError("");
      setShowLearning(true);
    }
  }, [open, data?._id, data?.topic]);

  const getStatus = (factor: Factor): FactorStatus => {
    const local = localResults[factor.factorId];
    // The server's effective status remains authoritative when a factor has
    // already been decomposed into child factors.
    if (factor.effectiveVerified) return "Verified";
    if (factor.children?.length) return "Needs practice";
    if (local?.status === "Completed" && local.score === 3) return "Verified";
    if ((factor.attempts || 0) > 0 || local) return "Needs practice";
    return "Pending";
  };

  const statusCounts = useMemo(() => {
    return allFactors.reduce(
      (counts, factor) => {
        counts[getStatus(factor)] += 1;
        return counts;
      },
      { Verified: 0, "Needs practice": 0, Pending: 0 } as Record<FactorStatus, number>,
    );
  }, [allFactors, localResults]);

  const nextRecommendedFactor = useMemo(() => {
    if (!selectedFactor) return null;
    const currentIndex = allFactors.findIndex((factor) => factor.factorId === selectedFactor.factorId);
    const ordered = [...allFactors.slice(currentIndex + 1), ...allFactors.slice(0, currentIndex)];
    return ordered.find((factor) => factor.factorId !== selectedFactor.factorId && getStatus(factor) !== "Verified") || null;
  }, [allFactors, selectedFactor, localResults]);

  const selectFactor = (factor: Factor) => {
    setSelectedFactorId(factor.factorId);
    setError("");
    setShowLearning(true);
  };

  const submitFactor = async (factor: Factor) => {
    const selected = answers[factor.factorId] || [];
    const questions = factor.verificationQuestions || [];
    if (selected.length !== questions.length || selected.some((answer) => !answer)) return;

    setBusyFactor(factor.factorId);
    setError("");
    try {
      const response: any = await submit({
        paperId,
        questionId,
        questionNumber,
        factorId: factor.factorId,
        answers: selected,
      }).unwrap();
      const result = response?.data || response;
      const score = Number(result?.score ?? 0);
      const totalQuestions = Number(result?.totalQuestions ?? questions.length);
      const status = String(result?.status || (score === totalQuestions ? "Completed" : "Pending"));
      setLocalResults((previous) => ({
        ...previous,
        [factor.factorId]: { score, totalQuestions, status },
      }));
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
      setExpandedIds((current) => new Set(current).add(factor.factorId));
      onRetry();
    } catch (e: any) {
      setError(e?.data?.message || "Unable to generate deeper factors.");
    } finally {
      setBusyFactor("");
    }
  };

  const renderStatus = (factor: Factor, compact = false) => {
    const status = getStatus(factor);
    if (status === "Verified") {
      return <span className={`text-green-700 ${compact ? "text-xs" : "text-sm"} font-semibold inline-flex items-center gap-1 shrink-0`}><CheckCircle2 size={compact ? 14 : 16} /> Verified</span>;
    }
    if (status === "Needs practice") {
      return <span className={`text-amber-700 ${compact ? "text-xs" : "text-sm"} font-semibold inline-flex items-center gap-1 shrink-0`}><CircleAlert size={compact ? 14 : 16} /> Needs practice</span>;
    }
    return <span className={`text-slate-500 ${compact ? "text-xs" : "text-sm"} font-medium inline-flex items-center gap-1 shrink-0`}><Circle size={compact ? 13 : 15} /> Pending</span>;
  };

  const renderFactor = (factor: Factor, isLast: boolean, prefixLast: boolean[] = []): any => {
    const hasChildren = Boolean(factor.children?.length);
    const isExpanded = expandedIds.has(factor.factorId);
    const isSelected = selectedFactorId === factor.factorId;

    return (
      <div key={factor.factorId} className="min-w-0">
        <div className={`flex items-center gap-1 min-h-9 rounded-md px-1 ${isSelected ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-slate-50"}`}>
          <span className="flex items-center shrink-0" aria-hidden="true">
            {prefixLast.map((ancestorIsLast, index) => (
              <span key={index} className="w-[18px] self-stretch flex justify-center text-slate-300 font-mono">{ancestorIsLast ? " " : "│"}</span>
            ))}
          </span>
          {hasChildren ? (
            <button type="button" aria-label={`${isExpanded ? "Collapse" : "Expand"} ${factor.name}`} aria-expanded={isExpanded}
              onClick={() => setExpandedIds((current) => { const next = new Set(current); if (next.has(factor.factorId)) next.delete(factor.factorId); else next.add(factor.factorId); return next; })}
              className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-200 text-slate-600 shrink-0">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : <span className="w-7 shrink-0 text-center text-slate-400 font-mono">·</span>}
          <span className="font-mono text-slate-400 text-sm shrink-0">{isLast ? "└──" : "├──"}</span>
          <button type="button" onClick={() => selectFactor(factor)} aria-pressed={isSelected}
            className="min-w-0 flex-1 text-left py-1.5 px-1 rounded text-sm font-semibold text-slate-900 hover:text-blue-700">
            {factor.name}
          </button>
          {renderStatus(factor, true)}
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-2 border-l border-slate-200">
            {factor.children.map((child, index) => renderFactor(child, index === factor.children.length - 1, [...prefixLast, isLast]))}
          </div>
        )}
      </div>
    );
  };

  const handleExploreAnother = () => {
    if (!nextRecommendedFactor) return;
    setSelectedFactorId(nextRecommendedFactor.factorId);
    setShowLearning(true);
    setError("");
    // Reveal the selected factor's ancestors so its location remains visible.
    const revealAncestors = (items: Factor[], ancestors: string[] = []): string[] | null => {
      for (const item of items) {
        if (item.factorId === nextRecommendedFactor.factorId) return ancestors;
        const found = revealAncestors(item.children || [], [...ancestors, item.factorId]);
        if (found) return found;
      }
      return null;
    };
    const ancestors = revealAncestors(data?.factors || []);
    if (ancestors?.length) setExpandedIds((current) => new Set([...current, ...ancestors]));
  };

  const selectedResult = selectedFactor ? localResults[selectedFactor.factorId] : undefined;
  const selectedStatus = selectedFactor ? getStatus(selectedFactor) : "Pending";

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="w-[96vw] max-w-5xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Network size={20} /> R3 Learning Workspace – {data?.topic || "Analysing question"}</DialogTitle>
        </DialogHeader>

        {isGenerating && !data ? (
          <div className="py-12 text-center"><Loader2 className="animate-spin mx-auto" /><p className="mt-3 text-sm text-slate-500">AI is identifying the topic and preparing root-factor verification sets. This may take a moment.</p></div>
        ) : null}

        {(generationError || error) && (
          <div className="rounded-lg bg-red-50 text-red-700 p-3 text-sm">{generationError || error}
            {!isGenerating && <button type="button" className="ml-2 underline font-semibold" onClick={onRetry}>Retry</button>}
          </div>
        )}

        {data && (
          <>
            <div className="rounded-xl bg-indigo-50 p-4">
              <div className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">AI identified topic</div>
              <div className="text-lg font-bold text-indigo-950">{data.topic}</div>
              <div className="text-sm text-indigo-800 mt-1">Secondary Factor: {data.secondaryFactor}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.5fr)] gap-3 items-start">
              <aside className="rounded-xl border bg-white p-3 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">R3 Explorer</h3>
                  <Network size={17} className="text-slate-500" />
                </div>
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="rounded-lg bg-green-50 p-2"><div className="text-lg font-bold text-green-700">{statusCounts.Verified}</div><div className="text-[10px] text-green-700">Verified</div></div>
                  <div className="rounded-lg bg-amber-50 p-2"><div className="text-lg font-bold text-amber-700">{statusCounts["Needs practice"]}</div><div className="text-[10px] text-amber-700">Practice</div></div>
                  <div className="rounded-lg bg-slate-100 p-2"><div className="text-lg font-bold text-slate-600">{statusCounts.Pending}</div><div className="text-[10px] text-slate-600">Pending</div></div>
                </div>
                <div className="rounded-lg border p-2 space-y-1">
                  <div className="font-mono font-semibold text-sm text-slate-900 flex items-center gap-2">
                    <button type="button" aria-label={`${rootExpanded ? "Collapse" : "Expand"} R3 Structure`} aria-expanded={rootExpanded}
                      onClick={() => setRootExpanded((value) => !value)} className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-200 text-slate-600">
                      {rootExpanded ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
                    </button>
                    R3 Structure
                  </div>
                  {rootExpanded && <div className="pl-1 space-y-1">{(data.factors || []).map((factor: Factor, index: number, list: Factor[]) => renderFactor(factor, index === list.length - 1))}</div>}
                </div>
                <p className="text-xs text-slate-500">Arrow expands a branch. Selecting a factor name opens only that factor's learning and verification panel.</p>
              </aside>

              <main className="min-w-0">
                {!selectedFactor ? (
                  <div className="rounded-xl border bg-slate-50 p-8 text-center space-y-2">
                    <Target className="mx-auto text-indigo-500" size={28} />
                    <h3 className="font-semibold text-slate-900">Choose a factor to begin</h3>
                    <p className="text-sm text-slate-600">Select any factor in the tree. You can follow the suggested order or explore another factor at any time.</p>
                  </div>
                ) : (
                  <section className="rounded-xl border bg-white p-4 space-y-4" aria-live="polite">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0"><div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Selected factor</div><h3 className="text-lg font-bold text-slate-900">{selectedFactor.name}</h3>
                        {selectedFactor.description && <p className="text-sm text-slate-600 mt-1">{selectedFactor.description}</p>}
                      </div>
                      {renderStatus(selectedFactor)}
                    </div>

                    {selectedResult && (
                      <div className={`rounded-lg p-3 text-sm ${selectedResult.score === selectedResult.totalQuestions ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>
                        <div className="font-semibold">{selectedResult.score === selectedResult.totalQuestions ? "Excellent! Factor verification passed." : "This factor needs more practice."}</div>
                        <div>{selectedResult.score}/{selectedResult.totalQuestions} correct answers.</div>
                      </div>
                    )}

                    <div className="rounded-lg bg-slate-50 p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium text-sm flex items-center gap-2"><BookOpen size={16} /> Learning content</div>
                        <button type="button" className="text-xs text-blue-700 font-semibold" onClick={() => setShowLearning((value) => !value)}>{showLearning ? "Hide" : "Review"}</button>
                      </div>
                      {showLearning && <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedFactor.learningContent || selectedFactor.description || "Review this concept carefully."}</p>}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2"><div className="font-medium text-sm flex items-center gap-2"><ClipboardCheck size={16} /> Verification</div><span className="text-xs text-slate-500">{(selectedFactor.verificationQuestions || []).length} questions · 3/3 to pass</span></div>
                      {(selectedFactor.verificationQuestions || []).map((question, index) => (
                        <div key={`${selectedFactor.factorId}-${index}`} className="border-t pt-3 space-y-2">
                          <p className="text-sm font-medium">{index + 1}. {question.question}</p>
                          {(question.options || []).map((option, optionIndex) => {
                            const value = String.fromCharCode(65 + optionIndex);
                            const isChecked = (answers[selectedFactor.factorId] || [])[index] === value;
                            return <label key={optionIndex} className="flex gap-2 items-start text-sm cursor-pointer rounded-md p-1 hover:bg-slate-50">
                              <input type="radio" name={`${selectedFactor.factorId}-${index}`} checked={isChecked} onChange={() => setAnswers((previous) => {
                                const next = [...(previous[selectedFactor.factorId] || Array((selectedFactor.verificationQuestions || []).length).fill(""))];
                                next[index] = value;
                                return { ...previous, [selectedFactor.factorId]: next };
                              })} />
                              <span>{value}. {option}</span>
                            </label>;
                          })}
                        </div>
                      ))}
                    </div>

                    <UIButton variant="sky" className="w-full" disabled={submitting || (answers[selectedFactor.factorId] || []).length !== (selectedFactor.verificationQuestions || []).length || (answers[selectedFactor.factorId] || []).some((answer) => !answer)} onClick={() => submitFactor(selectedFactor)}>
                      {submitting && busyFactor === selectedFactor.factorId ? "Submitting..." : "Submit verification"}
                    </UIButton>

                    {selectedStatus === "Needs practice" && selectedFactor.canExploreFurther && !selectedFactor.children?.length && (
                      <UIButton variant="secondary" className="w-full" disabled={expanding || busyFactor === selectedFactor.factorId} onClick={() => expandFactor(selectedFactor)}>
                        {expanding && busyFactor === selectedFactor.factorId ? "Generating deeper factors..." : "Explore Further – identify root factors"}
                      </UIButton>
                    )}

                    {selectedResult && selectedResult.score === selectedResult.totalQuestions && nextRecommendedFactor && (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-3 space-y-2">
                        <div className="text-sm font-semibold text-green-900 flex items-center gap-2"><CheckCircle2 size={16}/> Factor mastered</div>
                        <p className="text-xs text-green-800">Recommended next: {nextRecommendedFactor.name}. You can continue now or choose any other factor from the tree.</p>
                        <UIButton variant="sky" className="w-full" onClick={handleExploreAnother}>Continue to {nextRecommendedFactor.name} <ArrowRight size={16}/></UIButton>
                        <button type="button" onClick={() => setSelectedFactorId(null)} className="w-full text-xs text-green-800 underline">Return to R3 tree and choose another factor</button>
                      </div>
                    )}

                    {selectedStatus === "Needs practice" && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
                        <div className="text-sm font-semibold text-amber-900">Keep learning at your pace</div>
                        <p className="text-xs text-amber-800">Review the learning content, retry this factor, or select another factor. You are not blocked from exploring the tree.</p>
                        {nextRecommendedFactor && <UIButton variant="secondary" className="w-full" onClick={handleExploreAnother}>Explore another factor <ArrowRight size={15}/></UIButton>}
                      </div>
                    )}
                  </section>
                )}
              </main>
            </div>
          </>
        )}

        <div className="flex justify-end"><UIButton variant="secondary" onClick={onClose}>Close</UIButton></div>
      </DialogContent>
    </Dialog>
  );
}
