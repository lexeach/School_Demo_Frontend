import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UIButton from "@/UI/Elements/Button";
import { useSubmitR3FactorVerificationMutation, useExpandR3FactorMutation } from "@/service/learningVerification";
import { CheckCircle2, CircleAlert, Network, Loader2, BookOpen, ClipboardCheck } from "lucide-react";

type Factor = {
  factorId: string; name: string; description?: string; learningContent?: string;
  verificationQuestions: { question: string; options: string[]; questionNumber: number }[];
  children: Factor[]; ownVerified: boolean; effectiveVerified: boolean; canExploreFurther: boolean;
  score?: number | null;
};

export default function R3FactorDialog({ open, onClose, paperId, questionId, questionNumber, data, isGenerating, error: generationError, onRetry }: {
  open: boolean; onClose: () => void; paperId: string; questionId: string; questionNumber: number;
  data: any; isGenerating: boolean; error: string; onRetry: () => void;
}) {
  const [submit, { isLoading: submitting }] = useSubmitR3FactorVerificationMutation();
  const [expand, { isLoading: expanding }] = useExpandR3FactorMutation();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [busyFactor, setBusyFactor] = useState("");
  const [error, setError] = useState("");

  const submitFactor = async (factor: Factor) => {
    const selected = answers[factor.factorId] || [];
    if (selected.length !== 3 || selected.some(x => !x)) return;
    setBusyFactor(factor.factorId); setError("");
    try {
      await submit({ paperId, questionId, questionNumber, factorId: factor.factorId, answers: selected }).unwrap();
      onRetry();
    } catch (e: any) { setError(e?.data?.message || "Verification submission failed."); }
    finally { setBusyFactor(""); }
  };
  const expandFactor = async (factor: Factor) => {
    setBusyFactor(factor.factorId); setError("");
    try {
      await expand({ paperId, questionId, questionNumber, factorId: factor.factorId }).unwrap();
      onRetry();
    } catch (e: any) { setError(e?.data?.message || "Unable to generate deeper factors."); }
    finally { setBusyFactor(""); }
  };

  // Render factors as a familiar text tree. The original learning and
  // verification controls remain attached to each corresponding factor.
  const renderFactor = (factor: Factor, prefix = "", isLast = true, depth = 0): any => {
    const branch = isLast ? "└──" : "├──";
    const childPrefix = `${prefix}${isLast ? "    " : "│   "}`;
    const hasChildren = Boolean(factor.children?.length);

    return (
      <div key={factor.factorId} className="space-y-2">
        <div className="flex items-start gap-2 min-w-0 py-1">
          <span className="font-mono text-slate-400 whitespace-pre shrink-0 select-none">{prefix}{branch}</span>
          <div className="min-w-0 flex-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-slate-900">{factor.name}</span>
            {factor.effectiveVerified
              ? <span className="text-green-700 text-xs font-semibold inline-flex items-center gap-1"><CheckCircle2 size={15}/> Verified</span>
              : <span className="text-amber-700 text-xs font-semibold inline-flex items-center gap-1"><CircleAlert size={15}/> Not verified</span>}
          </div>
        </div>

        {factor.description && <p className="text-sm text-slate-600 ml-8">{factor.description}</p>}

        {!factor.effectiveVerified && !hasChildren && (
          <div className="ml-8 rounded-lg bg-slate-50 border border-slate-100 p-3 space-y-3">
            <div className="flex gap-2 items-center font-medium text-sm"><BookOpen size={16}/> Learning content</div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{factor.learningContent || factor.description || "Review this concept carefully."}</p>
            <div className="font-medium text-sm flex items-center gap-2"><ClipboardCheck size={16}/> Verification (3 questions)</div>
            {(factor.verificationQuestions || []).map((q, i) => (
              <div key={i} className="border-t pt-3 space-y-2">
                <p className="text-sm font-medium">{i + 1}. {q.question}</p>
                {q.options.map((option, j) => {
                  const value = String.fromCharCode(65 + j);
                  const selected = (answers[factor.factorId] || [])[i] === value;
                  return <label key={j} className="flex gap-2 items-start text-sm cursor-pointer">
                    <input type="radio" name={`${factor.factorId}-${i}`} checked={selected} onChange={() => setAnswers(prev => {
                      const next = [...(prev[factor.factorId] || ["", "", ""] )];
                      next[i] = value; return { ...prev, [factor.factorId]: next };
                    })}/>
                    <span>{value}. {option}</span>
                  </label>;
                })}
              </div>
            ))}
            <UIButton variant="sky" className="w-full" disabled={(answers[factor.factorId] || []).length !== 3 || (answers[factor.factorId] || []).some(x => !x)} onClick={() => submitFactor(factor)}>
              {submitting && busyFactor === factor.factorId ? "Submitting..." : "Submit verification"}
            </UIButton>
            {factor.canExploreFurther && (
              <UIButton variant="secondary" className="w-full" disabled={expanding && busyFactor === factor.factorId} onClick={() => expandFactor(factor)}>
                {expanding && busyFactor === factor.factorId ? "Generating..." : "Explore Further"}
              </UIButton>
            )}
          </div>
        )}

        {hasChildren && (
          <div className="space-y-2">
            {factor.children.map((child, index) => renderFactor(child, childPrefix, index === factor.children.length - 1, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    <DialogContent className="w-[96vw] max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle className="flex items-center gap-2"><Network size={20}/> R3 Factor – {data?.topic || "Analysing question"}</DialogTitle></DialogHeader>
      {isGenerating && !data ? <div className="py-12 text-center"><Loader2 className="animate-spin mx-auto"/> <p className="mt-3 text-sm text-slate-500">AI is identifying the topic and preparing root-factor verification sets. This may take a moment.</p></div> : null}
      {(generationError || error) && <div className="rounded-lg bg-red-50 text-red-700 p-3 text-sm">{generationError || error}
        {!isGenerating && <button type="button" className="ml-2 underline font-semibold" onClick={onRetry}>Retry</button>}
      </div>}
      {data && <>
        <div className="rounded-xl bg-indigo-50 p-4">
          <div className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">AI identified topic</div>
          <div className="text-lg font-bold text-indigo-950">{data.topic}</div>
          <div className="text-sm text-indigo-800 mt-1">Secondary Factor: {data.secondaryFactor}</div>
        </div>
        <div className="rounded-xl border bg-white p-4 space-y-3">
          <div className="font-mono font-semibold text-slate-900">└── R3 Structure</div>
          <div className="font-mono text-sm text-slate-400 pl-4">│</div>
          <div className="space-y-3">{(data.factors || []).map((factor: Factor, index: number, list: Factor[]) => renderFactor(factor, "    ", index === list.length - 1))}</div>
        </div>
      </>}
      <div className="flex justify-end"><UIButton variant="secondary" onClick={onClose}>Close</UIButton></div>
    </DialogContent>
  </Dialog>;
}
