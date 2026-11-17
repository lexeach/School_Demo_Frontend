import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VerificationResult from "@/components/LearningVerification/VerificationResult";
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
  // Navigation stack: each entry is a Secondary Factor whose Primary Factors are shown.
  const [navigationIds, setNavigationIds] = useState<string[]>([]);
  const [selectedFactorId, setSelectedFactorId] = useState<string | null>(null);
  const [busyFactor, setBusyFactor] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"selected" | "learning" | "verification">("selected");
  const [currentVerificationQuestion, setCurrentVerificationQuestion] = useState(0);
  const [resultPopup, setResultPopup] = useState<{ score: number; totalQuestions: number } | null>(null);
  const [progressionNotice, setProgressionNotice] = useState<{ requiredFactor: string; requestedFactor: string } | null>(null);

  const allFactors = useMemo(() => collectFactors(data?.factors || []), [data?.factors]);
  const selectedFactor = allFactors.find((factor) => factor.factorId === selectedFactorId) || null;

  // Resolve the current navigation level from the latest server data. This avoids
  // keeping stale factor objects when the Expand API refreshes the R3 structure.
  const navigationPath = navigationIds
    .map((id) => allFactors.find((factor) => factor.factorId === id))
    .filter(Boolean) as Factor[];
  const currentSecondaryFactor = navigationPath[navigationPath.length - 1] || null;
  const currentLevelFactors = currentSecondaryFactor
    ? (currentSecondaryFactor.children || [])
    : (data?.factors || []);
  const currentBreadcrumb = ["R3 Explorer", ...navigationPath.map((factor) => factor.name)];

  useEffect(() => {
    if (open && data?.factors) {
      setNavigationIds([]);
      setSelectedFactorId(null);
      setAnswers({});
      setLocalResults({});
      setError("");
      setResultPopup(null);
      setActiveTab("selected");
    }
  }, [open, data?._id, data?.topic]);

  const getStatus = (factor: Factor): FactorStatus => {
    const local = localResults[factor.factorId];
    // The server's effective status remains authoritative when a factor has
    // already been decomposed into child factors.
    if (factor.effectiveVerified) return "Verified";
    if (factor.children?.length) return "Needs practice";
    if (local?.score === 3 && local.totalQuestions === 3) return "Verified";
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


  // A student may open a factor only after every factor before it at the
  // current level has passed verification. Each deeper level has its own sequence.
  const canOpenFactorAtCurrentLevel = (factor: Factor) => {
    const targetIndex = currentLevelFactors.findIndex((item: Factor) => item.factorId === factor.factorId);
    if (targetIndex <= 0) return true;

    const firstUnverifiedPrevious = currentLevelFactors
      .slice(0, targetIndex)
      .find((previous: Factor) => getStatus(previous) !== "Verified");

    if (firstUnverifiedPrevious) {
      // Keep the learner focused on the first unfinished factor.
      setSelectedFactorId(firstUnverifiedPrevious.factorId);
      setActiveTab("selected");
      setProgressionNotice({
        requiredFactor: firstUnverifiedPrevious.name,
        requestedFactor: factor.name,
      });
      return false;
    }
    return true;
  };

  const selectFactor = (factor: Factor) => {
    if (!canOpenFactorAtCurrentLevel(factor)) return;
    setSelectedFactorId(factor.factorId);
    setCurrentVerificationQuestion(0);
    setError("");
    setActiveTab("selected");
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
      setResultPopup({ score, totalQuestions });
      setActiveTab("selected");
      onRetry();
    } catch (e: any) {
      setError(e?.data?.message || "Verification submission failed.");
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

  const navigateIntoFactor = async (factor: Factor) => {
    if (!canOpenFactorAtCurrentLevel(factor)) return;
    setError("");
    setSelectedFactorId(null);
    setCurrentVerificationQuestion(0);

    if (factor.children?.length) {
      setNavigationIds((previous) => [...previous, factor.factorId]);
      return;
    }

    if (!factor.canExploreFurther) {
      setSelectedFactorId(factor.factorId);
      return;
    }

    setBusyFactor(factor.factorId);
    try {
      await expand({ paperId, questionId, questionNumber, factorId: factor.factorId }).unwrap();
      // Navigate into this Secondary Factor. The refreshed query supplies its
      // newly generated Primary Factors; the list itself never renders deeper levels.
      setNavigationIds((previous) => [...previous, factor.factorId]);
      onRetry();
    } catch (e: any) {
      setError(e?.data?.message || "Unable to generate deeper factors.");
      setSelectedFactorId(factor.factorId);
    } finally {
      setBusyFactor("");
    }
  };

  const goBackToLevel = (index: number) => {
    setNavigationIds((previous) => previous.slice(0, index));
    setSelectedFactorId(null);
    setCurrentVerificationQuestion(0);
    setError("");
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
              <aside className="rounded-xl border bg-white p-3 space-y-3 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">R3 Explorer</h3>
                  <Network size={17} className="text-slate-500" />
                </div>
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="rounded-lg bg-green-50 p-2"><div className="text-lg font-bold text-green-700">{statusCounts.Verified}</div><div className="text-[10px] text-green-700">Verified</div></div>
                  <div className="rounded-lg bg-amber-50 p-2"><div className="text-lg font-bold text-amber-700">{statusCounts["Needs practice"]}</div><div className="text-[10px] text-amber-700">Practice</div></div>
                  <div className="rounded-lg bg-slate-100 p-2"><div className="text-lg font-bold text-slate-600">{statusCounts.Pending}</div><div className="text-[10px] text-slate-600">Pending</div></div>
                </div>

                {navigationIds.length > 0 && (
                  <div className="space-y-2">
                    <button type="button" onClick={() => goBackToLevel(navigationIds.length - 1)}
                      className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      <ArrowRight className="rotate-180" size={15} /> Back
                    </button>
                    <nav aria-label="R3 navigation path" className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
                      {currentBreadcrumb.map((crumb, index) => (
                        <span key={`${crumb}-${index}`} className="inline-flex items-center gap-1">
                          {index > 0 && <span aria-hidden="true">›</span>}
                          <button type="button" onClick={() => goBackToLevel(index)}
                            className={index === currentBreadcrumb.length - 1 ? "font-semibold text-slate-900" : "hover:text-blue-700 hover:underline"}>
                            {crumb}
                          </button>
                        </span>
                      ))}
                    </nav>
                  </div>
                )}

                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Network size={16} className="text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-slate-500">{currentSecondaryFactor ? "Primary factors of" : "Original R3 factor view"}</div>
                      <div className="font-semibold text-sm text-slate-900 truncate">{currentSecondaryFactor?.name || "R3 Structure"}</div>
                    </div>
                  </div>
                  {currentLevelFactors.length === 0 ? (
                    <div className="rounded-md bg-slate-50 p-4 text-center text-sm text-slate-500">
                      No deeper Primary Factors are available at this level yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {currentLevelFactors.map((factor: Factor) => (
                        <div key={factor.factorId} className={`py-3 space-y-2 ${selectedFactorId === factor.factorId ? "-mx-1 rounded-md bg-blue-50 px-2" : ""}`}>
                          <button type="button" onClick={() => selectFactor(factor)} aria-pressed={selectedFactorId === factor.factorId}
                            className="w-full min-w-0 flex items-start justify-between gap-2 text-left">
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-semibold text-slate-900">{factor.name}</span>
                            </span>
                            <span className="shrink-0 pt-0.5">{renderStatus(factor, true)}</span>
                          </button>
                          {(factor.children?.length > 0 || factor.canExploreFurther) && (
                            <button type="button" disabled={busyFactor === factor.factorId || expanding}
                              onClick={() => navigateIntoFactor(factor)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 disabled:opacity-50">
                              {busyFactor === factor.factorId ? <Loader2 size={13} className="animate-spin" /> : <ChevronRight size={13} />}
                              {factor.children?.length ? "View primary factors" : "Explore deeper"}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500">Only one level of Primary Factors is shown at a time. Use Back to return to the previous Secondary Factor.</p>
              </aside>

              <main className="min-w-0">
                {!selectedFactor ? (
                  <div className="rounded-xl border bg-slate-50 p-8 text-center space-y-2">
                    <Target className="mx-auto text-indigo-500" size={28} />
                    <h3 className="font-semibold text-slate-900">Choose a factor to begin</h3>
                    <p className="text-sm text-slate-600">Select a factor to open its learning and verification panel. Use “Explore deeper” to view that factor’s own Primary Factors.</p>
                  </div>
                ) : (
                  <section className="rounded-xl border bg-white p-4 space-y-4" aria-live="polite">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0"><div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">R3 factor details</div><h3 className="text-lg font-bold text-slate-900">{selectedFactor.name}</h3></div>
                      {renderStatus(selectedFactor)}
                    </div>

                    <div role="tablist" aria-label="Factor details" className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
                      <button type="button" role="tab" aria-selected={activeTab === "selected"} onClick={() => setActiveTab("selected")}
                        className={`rounded-md px-2 py-2 text-xs sm:text-sm font-semibold transition-colors ${activeTab === "selected" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
                        Selected factor
                      </button>
                      <button type="button" role="tab" aria-selected={activeTab === "learning"} onClick={() => setActiveTab("learning")}
                        className={`rounded-md px-2 py-2 text-xs sm:text-sm font-semibold transition-colors ${activeTab === "learning" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
                        Learning content
                      </button>
                      <button type="button" role="tab" aria-selected={activeTab === "verification"} onClick={() => setActiveTab("verification")}
                        className={`rounded-md px-2 py-2 text-xs sm:text-sm font-semibold transition-colors ${activeTab === "verification" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
                        Verification
                      </button>
                    </div>

                    {activeTab === "selected" && (
                      <div role="tabpanel" className="space-y-4">
                        <div className="rounded-lg bg-slate-50 p-4 space-y-2">
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Factor overview</div>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedFactor.description || "No additional description is available for this factor."}</p>
                          <div className="pt-1">{renderStatus(selectedFactor)}</div>
                        </div>
                        {selectedResult && (
                          <div className={`rounded-lg p-3 text-sm ${selectedResult.score === selectedResult.totalQuestions ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>
                            <div className="font-semibold">{selectedResult.score === selectedResult.totalQuestions ? "Excellent! Factor verification passed." : "This factor needs more practice."}</div>
                            <div>{selectedResult.score}/{selectedResult.totalQuestions} correct answers.</div>
                          </div>
                        )}
                        {(selectedFactor.children?.length > 0 || selectedFactor.canExploreFurther) && (
                          <UIButton variant="secondary" className="w-full" disabled={expanding || busyFactor === selectedFactor.factorId} onClick={() => navigateIntoFactor(selectedFactor)}>
                            {busyFactor === selectedFactor.factorId ? "Preparing next level..." : selectedFactor.children?.length ? `View ${selectedFactor.children.length} primary factors` : "Explore Further – identify primary factors"}
                          </UIButton>
                        )}
                        {selectedStatus === "Needs practice" && (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
                            <div className="text-sm font-semibold text-amber-900">Keep learning at your pace</div>
                            <p className="text-xs text-amber-800">Review the learning content and retry this factor. The next factor will unlock after this factor is verified.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "learning" && (
                      <div role="tabpanel" className="rounded-lg bg-slate-50 p-4 space-y-2">
                        <div className="font-semibold text-sm flex items-center gap-2"><BookOpen size={16} /> Learning content</div>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedFactor.learningContent || selectedFactor.description || "No learning content is available for this factor yet."}</p>
                      </div>
                    )}

                    {activeTab === "verification" && (
                      <div role="tabpanel" className="space-y-4">
                        {(() => {
                          const questions = selectedFactor.verificationQuestions || [];
                          const questionCount = questions.length;
                          const currentIndex = Math.min(currentVerificationQuestion, Math.max(questionCount - 1, 0));
                          const current = questions[currentIndex];
                          const factorAnswers = answers[selectedFactor.factorId] || Array(questionCount).fill("");
                          const allAnswered = questionCount > 0 && factorAnswers.length === questionCount && factorAnswers.every(Boolean);
                          const progress = questionCount ? ((currentIndex + 1) / questionCount) * 100 : 0;

                          if (!questionCount) {
                            return <div className="rounded-lg bg-slate-50 p-5 text-center text-sm text-slate-500">No verification questions are available for this factor yet.</div>;
                          }

                          return (
                            <>
                              <div className="flex items-center justify-between gap-2">
                                <div className="font-semibold text-sm flex items-center gap-2"><ClipboardCheck size={16} /> Verification</div>
                                <span className="text-xs font-medium text-slate-500">Question {currentIndex + 1} of {questionCount}</span>
                              </div>
                              <div className="space-y-2">
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                  <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                  <span>{factorAnswers.filter(Boolean).length} of {questionCount} answered</span>
                                  <span>All {questionCount} correct to pass</span>
                                </div>
                              </div>
                              <div className="rounded-xl border bg-white p-4 sm:p-5 space-y-5">
                                <div className="text-center space-y-2">
                                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Question {currentIndex + 1}</div>
                                  <h4 className="text-base sm:text-lg font-semibold text-slate-900">{current.question}</h4>
                                </div>
                                <div className="space-y-3">
                                  {(current.options || []).map((option, optionIndex) => {
                                    const value = String.fromCharCode(65 + optionIndex);
                                    const isChecked = factorAnswers[currentIndex] === value;
                                    return (
                                      <button key={`${selectedFactor.factorId}-${currentIndex}-${optionIndex}`} type="button"
                                        onClick={() => setAnswers((previous) => {
                                          const next = [...(previous[selectedFactor.factorId] || Array(questionCount).fill(""))];
                                          next[currentIndex] = value;
                                          return { ...previous, [selectedFactor.factorId]: next };
                                        })}
                                        aria-pressed={isChecked}
                                        className={`w-full rounded-lg border p-3 sm:p-4 text-left transition-colors ${isChecked ? "border-blue-600 bg-blue-50 ring-1 ring-blue-200" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}>
                                        <span className="flex items-start gap-3">
                                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${isChecked ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>{value}</span>
                                          <span className="pt-0.5 text-sm text-slate-800">{option}</span>
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2">
                                <UIButton variant="secondary" disabled={currentIndex === 0 || submitting} onClick={() => setCurrentVerificationQuestion((index) => Math.max(0, index - 1))}>Previous</UIButton>
                                {currentIndex < questionCount - 1 ? (
                                  <UIButton variant="sky" disabled={!factorAnswers[currentIndex] || submitting} onClick={() => setCurrentVerificationQuestion((index) => Math.min(questionCount - 1, index + 1))}>Next question <ArrowRight size={15} /></UIButton>
                                ) : (
                                  <UIButton variant="sky" disabled={!allAnswered || submitting} onClick={() => submitFactor(selectedFactor)}>{submitting && busyFactor === selectedFactor.factorId ? "Submitting..." : "Submit verification"}</UIButton>
                                )}
                              </div>
                              {!allAnswered && currentIndex === questionCount - 1 && <p className="text-xs text-amber-700">Please answer every question. Use Previous to review unanswered questions before submitting.</p>}
                            </>
                          );
                        })()}
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

      <Dialog open={!!progressionNotice} onOpenChange={(isOpen) => { if (!isOpen) setProgressionNotice(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CircleAlert className="text-amber-600" size={20} /> Complete previous factor first</DialogTitle>
          </DialogHeader>
          {progressionNotice && (
            <div className="space-y-3">
              <p className="text-sm text-slate-700">
                Please verify <strong>{progressionNotice.requiredFactor}</strong> before proceeding to <strong>{progressionNotice.requestedFactor}</strong>.
              </p>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
                Complete the current factor's verification with 3/3 correct answers to unlock the next factor.
              </div>
              <div className="flex justify-end">
                <UIButton variant="sky" onClick={() => setProgressionNotice(null)}>Understood</UIButton>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!resultPopup} onOpenChange={(isOpen) => { if (!isOpen) setResultPopup(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Factor verification result</DialogTitle>
          </DialogHeader>
          {resultPopup && (
            <VerificationResult
              score={resultPopup.score}
              totalQuestions={resultPopup.totalQuestions}
              isCompleted={resultPopup.score === resultPopup.totalQuestions && resultPopup.totalQuestions > 0}
              onClose={() => setResultPopup(null)}
              onRetry={() => {
                setResultPopup(null);
                setAnswers((previous) => ({
                  ...previous,
                  [selectedFactorId || ""]: [],
                }));
                setCurrentVerificationQuestion(0);
                setActiveTab("verification");
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
