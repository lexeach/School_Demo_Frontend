import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UIButton from "@/UI/Elements/Button";
import { useGenerateR3FactorMutation, useSubmitR3FactorVerificationMutation, useExpandR3FactorMutation } from "@/service/learningVerification";
import { CheckCircle2, CircleAlert, Network, Loader2, BookOpen, ClipboardCheck } from "lucide-react";

type Factor = {
  factorId: string; name: string; description?: string; learningContent?: string;
  verificationQuestions: { question: string; options: string[]; questionNumber: number }[];
  children: Factor[]; ownVerified: boolean; effectiveVerified: boolean; canExploreFurther: boolean;
  score?: number | null;
};

export default function R3FactorDialog({ open, onClose, paperId, questionId, questionNumber }: {
  open: boolean; onClose: () => void; paperId: string; questionId: string; questionNumber: number;
}) {
  const [generate, { isLoading }] = useGenerateR3FactorMutation();
  const [submit, { isLoading: submitting }] = useSubmitR3FactorVerificationMutation();
  const [expand, { isLoading: expanding }] = useExpandR3FactorMutation();
  const [data, setData] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [busyFactor, setBusyFactor] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const response: any = await generate({ paperId, questionId, questionNumber }).unwrap();
      setData(response.data || response);
    } catch (e: any) {
      setError(e?.data?.message || e?.message || "Unable to load R3 Factor.");
    }
  };
  useEffect(() => { if (open && paperId && questionId) { setData(null); load(); } }, [open, paperId, questionId, questionNumber]);

  const submitFactor = async (factor: Factor) => {
    const selected = answers[factor.factorId] || [];
    if (selected.length !== 3 || selected.some(x => !x)) return;
    setBusyFactor(factor.factorId); setError("");
    try {
      await submit({ paperId, questionId, questionNumber, factorId: factor.factorId, answers: selected }).unwrap();
      await load();
    } catch (e: any) { setError(e?.data?.message || "Verification submission failed."); }
    finally { setBusyFactor(""); }
  };
  const expandFactor = async (factor: Factor) => {
    setBusyFactor(factor.factorId); setError("");
    try {
      await expand({ paperId, questionId, questionNumber, factorId: factor.factorId }).unwrap();
      await load();
    } catch (e: any) { setError(e?.data?.message || "Unable to generate deeper factors."); }
    finally { setBusyFactor(""); }
  };

  const renderFactor = (factor: Factor, depth = 0): any => (
    <div key={factor.factorId} className="rounded-xl border bg-white p-4 space-y-3" style={{ marginLeft: Math.min(depth * 12, 36) }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-800">{factor.name}</div>
          {factor.description && <p className="text-sm text-slate-600 mt-1">{factor.description}</p>}
        </div>
        {factor.effectiveVerified
          ? <span className="text-green-700 text-sm font-semibold flex items-center gap-1"><CheckCircle2 size={17}/> Verified</span>
          : <span className="text-amber-700 text-sm font-semibold flex items-center gap-1"><CircleAlert size={17}/> Not verified</span>}
      </div>
      {!factor.effectiveVerified && (!factor.children || factor.children.length === 0) && (
        <div className="rounded-lg bg-slate-50 p-3 space-y-3">
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
                    const next = [...(prev[factor.factorId] || ["", "", ""])];
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
      {factor.children?.length > 0 && <div className="space-y-2 border-l-2 border-indigo-100 pl-3">{factor.children.map(child => renderFactor(child, depth + 1))}</div>}
    </div>
  );

  return <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    <DialogContent className="w-[96vw] max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle className="flex items-center gap-2"><Network size={20}/> R3 Factor – {data?.topic || "Analysing question"}</DialogTitle></DialogHeader>
      {!questionId && <div className="rounded-lg bg-red-50 text-red-700 p-3 text-sm">This question has no existing MongoDB question ID. R3 will not create or modify an ID.</div>}
      {isLoading && !data ? <div className="py-12 text-center"><Loader2 className="animate-spin mx-auto"/> <p className="mt-3 text-sm text-slate-500">AI is identifying the topic and preparing root-factor verification sets. This may take a moment.</p></div> : null}
      {error && <div className="rounded-lg bg-red-50 text-red-700 p-3 text-sm">{error}</div>}
      {data && <>
        <div className="rounded-xl bg-indigo-50 p-4">
          <div className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">AI identified topic</div>
          <div className="text-lg font-bold text-indigo-950">{data.topic}</div>
          <div className="text-sm text-indigo-800 mt-1">Secondary Factor: {data.secondaryFactor}</div>
        </div>
        <div className="space-y-3">{(data.factors || []).map((factor: Factor) => renderFactor(factor))}</div>
      </>}
      <div className="flex justify-end"><UIButton variant="secondary" onClick={onClose}>Close</UIButton></div>
    </DialogContent>
  </Dialog>;
}
