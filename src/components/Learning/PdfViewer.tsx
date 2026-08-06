import { FileText, ExternalLink } from "lucide-react";

interface PdfItem {

    title: string;

    url: string;

    source?: string;

    score?: number;

}

interface Props {

    pdfs: PdfItem[];

}

export default function PdfViewer({

    pdfs,

}: Props) {

    if (!pdfs.length) {

        return (

            <div className="text-center py-8 text-gray-500">

                No PDF Notes Available

            </div>

        );

    }

    return (

        <div className="space-y-4 pb-3">

            {pdfs.map((pdf, index) => (

                <div

                    key={index}

                    className="rounded-xl border border-purple-200 bg-purple-50 p-4 shadow-sm"

                >

                    <div className="flex gap-3">

                        <FileText

                            size={26}

                            className="text-purple-600 shrink-0 mt-1"

                        />

                        <div className="flex-1">

                            <h4 className="font-semibold text-purple-900 break-words">

                                {pdf.title}

                            </h4>

                            {pdf.source && (

                                <div className="mt-2">

                                    <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">

                                        {pdf.source}

                                    </span>

                                </div>

                            )}

                            <a

                                href={pdf.url}

                                target="_blank"

                                rel="noopener noreferrer"

                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition"

                            >

                                <ExternalLink size={16} />

                                Open PDF

                            </a>

                        </div>

                    </div>

                </div>

            ))}

        </div>

    );

}
