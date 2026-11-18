import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VerificationResult from "@/components/LearningVerification/VerificationResult";
import UIButton from "@/UI/Elements/Button";
import {
  useSubmitR3FactorVerificationMutation,
  useGenerateR3FactorQuestionsMutation,
  useExpandR3FactorMutation,
  useGenerateR3FactorLearningContentMutation,
} from "@/service/learningVerification";
import {
  CheckCircle2,
  CircleAlert,
  Circle,
  Lock,
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
  onRetry: () => Promise<void> | void;
}) {
  const [submit, { isLoading: submitting }] = useSubmitR3FactorVerificationMutation();
  const [generateQuestions, { isLoading: generatingQuestions }] = useGenerateR3FactorQuestionsMutation();
  const [expand, { isLoading: expanding }] = useExpandR3FactorMutation();
  const [generateLearningContent] = useGenerateR3FactorLearningContentMutation();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [questionSets, setQuestionSets] = useState<Record<string, { attemptId: string; questions: VerificationQuestion[] }>>({});
  const [localResults, setLocalResults] = useState<Record<string, LocalResult>>({});
  // Navigation stack: each entry is a Secondary Factor whose Primary Factors are shown.
  const [navigationIds, setNavigationIds] = useState<string[]>([]);
  const [selectedFactorId, setSelectedFactorId] = useState<string | null>(null);
  const [busyFactor, setBusyFactor] = useState("");
  const [learningBusyFactor, setLearningBusyFactor] = useState("");
  const [learningContentByFactor, setLearningContentByFactor] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"learning" | "verification">("verification");
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

  // Reset workspace only when the dialog opens. Expansion refreshes data and may
  // temporarily clear the query result; that must not reset the learner's level.
  useEffect(() => {
    if (open) {
      setNavigationIds([]);
      setSelectedFactorId(null);
      setAnswers({});
      setQuestionSets({});
      setLocalResults({});
      setLearningContentByFactor({});
      setLearningBusyFactor("");
      setError("");
      setResultPopup(null);
      setActiveTab("verification");
    }
  }, [open]);

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

  // Automatically focus the first unfinished factor whenever a level is
  // opened with no current selection. This keeps the right panel useful on
  // initial open, after navigating deeper, and when returning with Back.
  // The existing sequential-access rule remains enforced by selectFactor().
  useEffect(() => {
    if (!open || !data?.factors?.length || selectedFactorId) return;

    const firstUnverifiedFactor = currentLevelFactors.find(
      (factor: Factor) => getStatus(factor) !== "Verified",
    );

    if (firstUnverifiedFactor) {
      setSelectedFactorId(firstUnverifiedFactor.factorId);
      setCurrentVerificationQuestion(0);
      setActiveTab("verification");
    }
  }, [open, data?.factors, currentLevelFactors, selectedFactorId, localResults]);

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
      setActiveTab("verification");
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
    setActiveTab("verification");
  };

  const submitFactor = async (factor: Factor) => {
    const selected = answers[factor.factorId] || [];
    const questions = questionSets[factor.factorId]?.questions || [];
    if (selected.length !== questions.length || selected.some((answer) => !answer)) return;

    setBusyFactor(factor.factorId);
    setError("");
    try {
      const response: any = await submit({
        paperId,
        questionId,
        questionNumber,
        factorId: factor.factorId,
        attemptId: questionSets[factor.factorId]?.attemptId,
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
      setQuestionSets((previous) => { const next = { ...previous }; delete next[factor.factorId]; return next; });
      setAnswers((previous) => ({ ...previous, [factor.factorId]: [] }));
      setActiveTab("verification");
      // Do not call onRetry here: it regenerates/refetches the R3 data and
      // can reset the dialog while the result popup is being displayed.
      // The latest result is already reflected locally; fresh server data
      // will be loaded the next time the learner opens R3.
    } catch (e: any) {
      setError(e?.data?.message || "Verification submission failed.");
    } finally {
      setBusyFactor("");
    }
  };

  const handleGenerateQuestions = async (factor: Factor) => {
    setError("");
    setAnswers((previous) => ({ ...previous, [factor.factorId]: [] }));
    setCurrentVerificationQuestion(0);
    try {
      const response: any = await generateQuestions({ paperId, questionId, questionNumber, factorId: factor.factorId }).unwrap();
      const payload = response?.data || response;
      const questions = (payload?.questions || []).map((q: any, i: number) => ({ ...q, questionNumber: i + 1 }));
      if (questions.length !== 3 || !payload?.attemptId) throw new Error("A valid set of three questions was not returned.");
      setQuestionSets((previous) => ({ ...previous, [factor.factorId]: { attemptId: payload.attemptId, questions } }));
      setAnswers((previous) => ({ ...previous, [factor.factorId]: ["", "", ""] }));
    } catch (e: any) {
      setError(e?.data?.message || e?.message || "Unable to generate verification questions. Please try again.");
    }
  };

  const getFactorLearningContent = (factor: Factor) =>
    learningContentByFactor[factor.factorId] ?? factor.learningContent ?? "";

  const handleGenerateLearningContent = async (factor: Factor) => {
    if (getFactorLearningContent(factor).trim() || learningBusyFactor) return;
    setError("");
    setLearningBusyFactor(factor.factorId);
    try {
      const response: any = await generateLearningContent({
        paperId,
        questionId,
        questionNumber,
        factorId: factor.factorId,
      }).unwrap();
      const payload = response?.data || response;
      const content = String(payload?.learningContent || "").trim();
      if (!content) throw new Error("Learning content was not returned. Please try again.");
      setLearningContentByFactor((previous) => ({ ...previous, [factor.factorId]: content }));
      // The backend has saved this against the question-specific R3 factor.
      // Keep the current factor selected; a fresh R3 open will load the saved text.
    } catch (e: any) {
      setError(e?.data?.message || e?.message || "Unable to generate learning content. Please try again.");
    } finally {
      setLearningBusyFactor("");
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
      // Refresh the saved tree before navigating. Keep navigation state while
      // the parent query briefly refreshes, then enter the expanded factor.
      await onRetry();
      setSelectedFactorId(null);
      setCurrentVerificationQuestion(0);
      setNavigationIds((previous) => [...previous, factor.factorId]);
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
          <div className="py-12 text-center"><Loader2 className="animate-spin mx-auto" /><p className="mt-3 text-sm text-slate-500">AI is identifying the topic and preparing the R3 factor structure. This may take a moment.</p></div>
        ) : null}

        {(generationError || error) && (
          <div className="rounded-lg bg-red-50 text-red-700 p-3 text-sm">{generationError || error}
            {!isGenerating && <button type="button" className="ml-2 underline font-semibold" onClick={onRetry}>Retry</button>}
          </div>
        )}

        {data && (
          <>
            <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 p-4 sm:p-5 text-white shadow-md">
              <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-100">
                    <Network size={14} /> R3 Learning Journey
                  </div>
                  <div className="text-xl font-extrabold tracking-tight">{data.topic}</div>
                  <div className="mt-1 text-sm text-blue-100">Secondary Factor · {data.secondaryFactor}</div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-right backdrop-blur-sm">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-100">Current level</div>
                  <div className="text-sm font-bold">{currentSecondaryFactor?.name || "R3 Structure"}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[minmax(280px,0.88fr)_minmax(0,1.55fr)] gap-4 items-start">
              <aside className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 space-y-4 min-w-0 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-slate-900 tracking-tight">R3 Explorer</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">One level at a time · Step-by-step mastery</p>
                  </div>
                  <span className="rounded-lg bg-indigo-100 p-2 text-indigo-700"><Network size={17} /></span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white p-2.5 shadow-sm"><div className="text-xl font-extrabold text-emerald-700">{statusCounts.Verified}</div><div className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">Verified</div></div>
                  <div className="rounded-xl border border-amber-100 bg-gradient-to-b from-amber-50 to-white p-2.5 shadow-sm"><div className="text-xl font-extrabold text-amber-700">{statusCounts["Needs practice"]}</div><div className="text-[10px] font-bold uppercase tracking-wide text-amber-700">Practice</div></div>
                  <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-slate-100 to-white p-2.5 shadow-sm"><div className="text-xl font-extrabold text-slate-600">{statusCounts.Pending}</div><div className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Pending</div></div>
                </div>

                {navigationIds.length > 0 && (
                  <div className="space-y-2">
                    <button type="button" onClick={() => goBackToLevel(navigationIds.length - 1)}
                      className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50">
                      <ArrowRight className="rotate-180" size={15} /> Back
                    </button>
                    <nav aria-label="R3 navigation path" className="flex flex-wrap items-center gap-1 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
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

                <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50/90 via-white to-white shadow-sm">
                  <div className="flex items-center gap-2 border-b border-indigo-100 bg-indigo-100/70 px-3 py-3 min-w-0">
                    <span className="rounded-lg bg-white p-2 text-indigo-700 shadow-sm"><Network size={16} /></span>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-[0.13em] text-indigo-600">{currentSecondaryFactor ? "Primary factors of active secondary factor" : "Original R3 factor view"}</div>
                      <div className="font-extrabold text-sm text-indigo-950 truncate">{currentSecondaryFactor?.name || "R3 Structure"}</div>
                    </div>
                  </div>
                  {currentLevelFactors.length === 0 ? (
                    <div className="m-3 rounded-xl border border-dashed border-indigo-200 bg-white p-5 text-center text-sm text-slate-500">
                      No deeper Primary Factors are available at this level yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {currentLevelFactors.map((factor: Factor, factorIndex: number) => {
                        const blockingFactor = currentLevelFactors.slice(0, factorIndex).find((previous: Factor) => getStatus(previous) !== "Verified");
                        const isLocked = !!blockingFactor;
                        const isSelected = selectedFactorId === factor.factorId;
                        const factorStatus = getStatus(factor);
                        return (
                          <div key={factor.factorId} className={`mx-2 my-2 overflow-hidden rounded-xl border transition-all duration-200 ${
                            isSelected ? "border-indigo-400 bg-gradient-to-r from-indigo-100 to-blue-50 shadow-md ring-1 ring-indigo-200" :
                            factorStatus === "Verified" ? "border-emerald-200 bg-emerald-50/70 hover:border-emerald-300" :
                            isLocked ? "border-slate-200 bg-slate-100/80 opacity-75" :
                            factorStatus === "Needs practice" ? "border-amber-200 bg-amber-50/70 hover:border-amber-300" :
                            "border-white bg-white hover:border-indigo-200 hover:bg-indigo-50/60"
                          }`}>
                            <button type="button" onClick={() => selectFactor(factor)} aria-pressed={isSelected}
                              className="w-full min-w-0 flex items-center justify-between gap-2 px-3 py-3 text-left">
                              <span className="flex min-w-0 items-center gap-2.5">
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${
                                  isSelected ? "bg-indigo-600 text-white" :
                                  factorStatus === "Verified" ? "bg-emerald-100 text-emerald-700" :
                                  isLocked ? "bg-slate-200 text-slate-500" :
                                  factorStatus === "Needs practice" ? "bg-amber-100 text-amber-700" : "bg-white text-indigo-600 shadow-sm"
                                }`}>{isLocked ? <Lock size={13}/> : factorStatus === "Verified" ? <CheckCircle2 size={15}/> : String(factorIndex + 1).padStart(2, "0")}</span>
                                <span className="min-w-0">
                                  <span className={`block truncate text-sm font-bold ${isSelected ? "text-indigo-950" : "text-slate-900"}`}>{factor.name}</span>
                                  {isLocked && <span className="mt-0.5 block text-[10px] font-medium text-slate-500">Complete {blockingFactor.name} first</span>}
                                  {isSelected && <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wide text-indigo-600">Currently selected</span>}
                                </span>
                              </span>
                              <span className="shrink-0">{isLocked ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500"><Circle size={12}/> Locked</span> : renderStatus(factor, true)}</span>
                            </button>
                            {!isLocked && (factor.children?.length > 0 || factor.canExploreFurther) && (
                              <div className="border-t border-indigo-100/80 px-3 py-2">
                                <button type="button" disabled={busyFactor === factor.factorId || expanding}
                                  onClick={() => navigateIntoFactor(factor)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1.5 text-[11px] font-bold text-indigo-700 shadow-sm transition hover:bg-white disabled:opacity-50">
                                  {busyFactor === factor.factorId ? <Loader2 size={13} className="animate-spin" /> : <ChevronRight size={13} />}
                                  {factor.children?.length ? "Open primary factors" : "Explore deeper"}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="border-t border-indigo-100 bg-white/80 px-3 py-2 text-[10px] font-medium text-indigo-700">
                    <span className="inline-flex items-center gap-1"><CheckCircle2 size={12}/> Verify in sequence to unlock the next factor</span>
                  </div>
                </div>
                <p className="rounded-lg bg-slate-100 px-3 py-2 text-[11px] leading-relaxed text-slate-500">Only one level of Primary Factors is shown at a time. Use Back to return to the previous Secondary Factor.</p>
              </aside>

              <main className="min-w-0">
                {!selectedFactor ? (
                  <div className="rounded-2xl border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-10 text-center space-y-3 shadow-sm">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 shadow-inner"><Target size={28} /></span>
                    <h3 className="font-semibold text-slate-900">
                      {currentLevelFactors.length > 0 && currentLevelFactors.every((factor: Factor) => getStatus(factor) === "Verified")
                        ? "All factors verified"
                        : "Choose a factor to begin"}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {currentLevelFactors.length > 0 && currentLevelFactors.every((factor: Factor) => getStatus(factor) === "Verified")
                        ? "You have completed every factor at this level. Use Back to return or close the R3 Explorer."
                        : "Select a factor to open its learning and verification panel. Use “Explore deeper” to view that factor’s own Primary Factors."}
                    </p>
                  </div>
                ) : (
                  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-indigo-100/60 space-y-0" aria-live="polite">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 px-4 py-4 text-white">
                      <div className="min-w-0"><div className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-200">Selected R3 factor</div><h3 className="text-xl font-extrabold tracking-tight">{selectedFactor.name}</h3><p className="mt-1 text-xs text-indigo-200">{currentSecondaryFactor?.name || "Original R3 Structure"}</p></div>
                      <span className="rounded-full bg-white px-3 py-1.5 text-slate-800 shadow-sm">{renderStatus(selectedFactor)}</span>
                    </div>

                    <div className="bg-white px-4 pt-4">
                    <div role="tablist" aria-label="Factor details" className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
                      {((selectedFactor.attempts || 0) > 0 && (selectedFactor.score ?? 0) < 3) || (localResults[selectedFactor.factorId]?.score ?? 3) < 3 && !!localResults[selectedFactor.factorId] ? (
                        <button type="button" role="tab" aria-selected={activeTab === "learning"} onClick={() => setActiveTab("learning")}
                          className={`rounded-lg px-2 py-2.5 text-xs sm:text-sm font-bold transition-all ${activeTab === "learning" ? "bg-gradient-to-b from-indigo-600 to-blue-700 text-white shadow-md" : "text-slate-600 hover:bg-white hover:text-indigo-700"}`}>
                          Learning content
                        </button>
                      ) : <div className="rounded-lg px-2 py-2.5 text-center text-xs sm:text-sm font-bold text-slate-400">Learning content unlocks after a failed attempt</div>}
                      <button type="button" role="tab" aria-selected={activeTab === "verification"} onClick={() => setActiveTab("verification")}
                        className={`rounded-lg px-2 py-2.5 text-xs sm:text-sm font-bold transition-all ${activeTab === "verification" ? "bg-gradient-to-b from-indigo-600 to-blue-700 text-white shadow-md" : "text-slate-600 hover:bg-white hover:text-indigo-700"}`}>
                        Verification
                      </button>
                    </div>

                    </div>
                    <div className="p-4 sm:p-5 space-y-4">
                    {activeTab === "learning" && (
                      <div role="tabpanel" className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-5 space-y-4 shadow-sm">
                        <div className="font-extrabold text-sm flex items-center gap-2 text-sky-800">
                          <span className="rounded-lg bg-white p-2 shadow-sm"><BookOpen size={16} /></span>
                          Learning content
                        </div>
                        {getFactorLearningContent(selectedFactor).trim() ? (
                          <div className="rounded-xl border border-sky-100 bg-white p-4 shadow-sm">
                            <p className="text-sm leading-7 text-slate-700 whitespace-pre-wrap">{getFactorLearningContent(selectedFactor)}</p>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-sky-200 bg-white/90 p-6 text-center space-y-3">
                            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                              <BookOpen size={22} />
                            </span>
                            <div>
                              <h4 className="font-bold text-slate-900">Learning content is not generated yet</h4>
                              <p className="mt-1 text-sm text-slate-500">Generate an explanation for this factor only when you need it.</p>
                            </div>
                            <UIButton
                              variant="sky"
                              className="w-full sm:w-auto shadow-md"
                              disabled={learningBusyFactor === selectedFactor.factorId || !!learningBusyFactor}
                              onClick={() => handleGenerateLearningContent(selectedFactor)}
                            >
                              {learningBusyFactor === selectedFactor.factorId ? (
                                <><Loader2 size={15} className="mr-2 animate-spin" /> Generating learning content...</>
                              ) : (
                                <><BookOpen size={15} className="mr-2" /> Generate Learning Content</>
                              )}
                            </UIButton>
                            <p className="text-[11px] text-slate-400">Approximately 150–200 words · AI-generated on request</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "verification" && (
                      <div role="tabpanel" className="space-y-4">
                        {(() => {
                          const currentSet = questionSets[selectedFactor.factorId];
                          const questions = currentSet?.questions || [];
                          const questionCount = questions.length;
                          const currentIndex = Math.min(currentVerificationQuestion, Math.max(questionCount - 1, 0));
                          const current = questions[currentIndex];
                          const factorAnswers = answers[selectedFactor.factorId] || Array(questionCount).fill("");
                          const allAnswered = questionCount > 0 && factorAnswers.length === questionCount && factorAnswers.every(Boolean);
                          const progress = questionCount ? ((currentIndex + 1) / questionCount) * 100 : 0;

                          if (!questionCount) {
                            return <div className="rounded-2xl border border-violet-100 bg-gradient-to-b from-violet-50 to-white p-6 text-center space-y-3">
                              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm"><ClipboardCheck size={22} /></div>
                              <h4 className="font-bold text-slate-900">Ready to verify this factor?</h4>
                              <p className="text-sm text-slate-500">Generate a fresh set of three questions. Each new attempt uses a new set.</p>
                              <UIButton variant="sky" disabled={generatingQuestions} onClick={() => handleGenerateQuestions(selectedFactor)}>
                                {generatingQuestions ? <><Loader2 size={15} className="mr-2 animate-spin" /> Generating questions...</> : <><RefreshCw size={15} className="mr-2" /> Generate Verification Questions</>}
                              </UIButton>
                            </div>;
                          }

                          return (
                            <>
                              <div className="flex items-center justify-between gap-2 rounded-xl border border-violet-100 bg-violet-50 px-3 py-3">
                                <div className="font-extrabold text-sm flex items-center gap-2 text-violet-800"><span className="rounded-lg bg-white p-2 shadow-sm"><ClipboardCheck size={16} /></span> Verification challenge</div>
                                <span className="text-xs font-medium text-slate-500">Question {currentIndex + 1} of {questionCount}</span>
                              </div>
                              <div className="space-y-2">
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                  <div className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                  <span>{factorAnswers.filter(Boolean).length} of {questionCount} answered</span>
                                  <span>All {questionCount} correct to pass</span>
                                </div>
                              </div>
                              <div className="rounded-2xl border border-violet-100 bg-gradient-to-b from-white to-violet-50/50 p-4 sm:p-5 space-y-5 shadow-sm">
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
                                        className={`w-full rounded-xl border p-3 sm:p-4 text-left transition-all duration-150 ${isChecked ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100 shadow-sm" : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm"}`}>
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
                    </div>
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
