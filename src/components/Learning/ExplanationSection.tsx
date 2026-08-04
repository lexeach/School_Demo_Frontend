interface Props {

    explanation: string;

    loading: boolean;

}

export default function ExplanationSection({

    explanation,

    loading,

}: Props) {

    if (loading) {

        return (

            <div className="rounded-xl border p-6">

                <div className="animate-pulse space-y-3">

                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>

                    <div className="h-4 bg-gray-200 rounded"></div>

                    <div className="h-4 bg-gray-200 rounded"></div>

                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>

                </div>

            </div>

        );

    }

    return (

        <div

            className="
rounded-xl
border
bg-white
p-4
sm:p-6
shadow-sm
overflow-hidden
"

        >

            <h3

                className="
                    text-lg
                    font-semibold
                    mb-4
                "

            >

                AI Explanation

            </h3>

            <div

               className="
whitespace-pre-wrap
break-words
leading-7
text-sm
sm:text-base
text-gray-700
"

            >

                {explanation}

            </div>

        </div>

    );

}
